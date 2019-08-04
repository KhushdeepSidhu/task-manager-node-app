const express = require ( 'express' )
const auth = require ( '../middleware/auth' )
const User = require ( '../models/user' )
const multer = require ( 'multer' )

const router = new express.Router ()

// HTTP end point to login 
router.post ( '/users/login', async ( req, res ) => {

    try {
        const user = await User.findByCredentials ( req.body.email, req.body.password )
        const token = await user.generateAuthToken ()
        res.send ( { user, token } )
    } catch ( error ) {
        res.status ( 400 ).send ( error )
    }

} )

// HTTP end point to create user
router.post ( '/users', async ( req, res ) => {

    const user = new User ( req.body )

    try {
        const token = await user.generateAuthToken ()
        const savedUser = await user.save ()
        res.status ( 200 ).send ( { savedUser, token } )
    } catch ( error ) {
        res.status ( 400 ).send ( error )
    }

} )

// HTTP end point to read user profile
router.get ( '/users/me', auth, async ( req, res ) => {

    res.send ( req.user )
    
} )

// HTTP end point to read a single user
router.get ( '/users/:id', async ( req, res ) => {

    const _id = req.params.id

    try {
        const user = await User.findById ( _id )
        if ( !user ) {
            return res.sendStatus ( 404 )
        }
        res.status ( 200 ).send ( user )

    } catch ( error ) {
        res.status ( 500 ).send ( error )
    }

} )

// HTTP end point to update a user 
router.patch ( '/users/me', auth, async ( req, res ) => {

    const updates = Object.keys ( req.body )
    const allowedUpdates = [ 'name', 'age', 'email', 'password' ]
    const isValidOperation = updates.every ( ( update ) => allowedUpdates.includes ( update ) )
    if ( !isValidOperation ) {
        return res.status( 400 ).send ( 'Invalid Updates' )
    }

    try {
        updates.forEach ( ( update ) => req.user [ update ] = req.body [ update ] )
        await req.user.save ()
        res.send ( req.user )
    } catch ( error ) {
        res.status ( 400 ).send ( error )
    }

} )

// HTTP end point to log out a user 
router.post( '/users/logout', auth, async ( req, res ) => {

    try {
        const user = req.user
        const token = req.token
        user.tokens = user.tokens.filter ( ( element ) => element.token !== token )
        await user.save()
        res.send ()
    } catch ( error ) {
        res.status( 400 ).send ( error )
    }
    
} )

// HTTP end point to logout user from all session
router.post( '/users/logoutAll', auth, async ( req, res ) => {

    try {
        const user = req.user
        const token = req.token  
        user.tokens = []
        await user.save()
        res.send ()
    } catch ( error ) {
        res.status( 400 ).send ( error )
    }

} )

// HTTP end point to delete a user
router.delete ( '/users/me', auth, async ( req, res ) => {

    try {
        await req.user.remove()
        res.send ( req.user )
    } catch ( error ) {
        res.sendStatus ( 500 )
    }

} )

// HTTP end point upload a picture
const upload = multer ( {
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter ( req, file, callback ) {
        if ( !file.originalname.match ( /\.(jpg|jpeg|png)$/ ) ) {
            return callback ( new Error ( 'Please upload an image file.' ) )
        }
        callback ( undefined, true )
    }
} )
router.post( '/users/me/avatar', upload.single ( 'avatar' ), ( req, res ) => {
    res.send ()
} )

module.exports = router