const express = require ( 'express' )
const User = require ( '../models/user' )

const router = new express.Router ()

// HTTP end point to login 
router.post ( '/users/login', async ( req, res ) => {

    try {
        const user = await User.findByCredentials ( req.body.email, req.body.password )
        res.send ( user )
    } catch ( error ) {
        res.status ( 400 ).send ( error )
    }

} )

// HTTP end point to create user
router.post ( '/users', async ( req, res ) => {

    const user = new User ( req.body )

    try {
        const savedUser = await user.save ()
        res.status ( 201 ).send ( savedUser )
    } catch ( error ) {
        res.status ( 400 ).send ( error )
    }

} )

// HTTP end point to read multiple users
router.get ( '/users', async ( req, res ) => {

    try {

        const users = await User.find ( {} )
        if ( !users.length ) {
            return res.sendStatus ( 404 )
        }
    
        res.send ( users )
    } catch ( error ) {
        res.status ( 500 ).send ( error )
    } 
    
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
router.patch ( '/users/:id', async ( req, res ) => {

    const updates = Object.keys ( req.body )
    const allowedUpdates = [ 'name', 'age', 'email', 'password' ]
    const isValidOperation = updates.every ( ( update ) => allowedUpdates.includes ( update ) )
    console.log ( isValidOperation )
    if ( !isValidOperation ) {
        return res.status( 400 ).send ( 'Invalid Updates' )
    }

    try {
        const user = await User.findById ( req.params.id )
        if ( !user ) {
            return res.sendStatus ( 404 )
        }
        updates.forEach ( ( update ) => user [ update ] = req.body [ update ] )
        const savedUser = await user.save ()
        res.send ( savedUser )
    } catch ( error ) {
        res.status ( 400 ).send ( error )
    }

} )

// HTTP end point to delete a user
router.delete ( '/users/:id', async ( req, res ) => {

    try {
        const user = await User.findByIdAndDelete ( req.params.id )
        if ( !user ) {
            return res.sendStatus ( 404 )
        }

        res.send ( user )
    } catch ( error ) {
        res.sendStatus ( 500 )
    }

} )

module.exports = router