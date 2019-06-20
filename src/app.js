const path = require ( 'path' )
const express = require ( 'express' )
require ( './db/mongoose' )
const User = require ( './models/user' )
const Task = require ( './models/task' )

const app = express ()

// Define paths
const publicDirPath = path.join ( __dirname, '../public' )

// configure port to make the application on heroku also
const port = process.env.PORT || 3000

// Setup static directory to serve
app.use ( express.static ( publicDirPath ) )

// Parse incoming JSON into a JavaScript object which you can access on req.body. 
app.use ( express.json () )

// HTTP end point to create user
app.post ( '/users', async ( req, res ) => {

    const user = new User ( req.body )

    try {
        await user.save ()
        res.status ( 201 ).send ( savedUser )
    } catch ( error ) {
        res.status ( 400 ).send ( error )
    }

} )

// HTTP end point to read multiple users
app.get ( '/users', async ( req, res ) => {

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
app.get ( '/users/:id', async ( req, res ) => {

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
app.patch ( '/users/:id', async ( req, res ) => {

    const updates = Object.keys ( req.body )
    console.log ( updates )
    const allowedUpdates = [ 'name', 'age', 'email', 'password' ]
    const isValidOperation = updates.every ( ( update ) => allowedUpdates.includes ( update ) )

    if ( !isValidOperation ) {
        return res.status( 400 ).send ( 'Invalid Updates' )
    }

    try {
        const user = await User.findByIdAndUpdate ( req.params.id, req.body, { new: true, runValidators: true } )
        if ( !user ) {
            return res.sendStatus ( 404 )
        }
        res.send ( user )
    } catch ( error ) {
        res.status ( 400 ).send ( error )
    }

} )

// HTTP end point to create a task
app.post ( '/tasks', async ( req, res ) => {

    const task = new Task ( req.body )

    try {
        await task.save ()
        res.status( 201 ).send ( task )
    } catch ( error ) {
        res.status( 400 ).send ( error )
    }

} )

// HTTP end point to read multiple tasks
app.get ( '/tasks', async ( req, res ) => {

    try {

        const tasks = await Task.find ( {} )
        if ( !tasks.length ) {
            return res.sendStatus ( 404 )
        }
        res.send ( tasks )

    } catch ( error ) {
        res.status ( 500 ).send ( error )
    }

} )

// HTTP end point to read a task
app.get ( '/tasks/:id', async ( req, res ) => {

    const _id = req.params.id

    try {
        const task = await Task.findById ( _id )
        if ( !task ) {
            return res.sendStatus ( 404 )
        }
        res.send ( task )

    } catch ( error ) {
        res.status ( 500 ).send ( error )
    }

} )

// HTTP end point to update a task
app.patch ( '/tasks/:id', async ( req, res ) => {

    const updates = Object.keys ( req.body )
    const allowedUpdates = [ 'description', 'completed' ]
    const isValidOperation = updates.every ( ( update ) => allowedUpdates.includes ( update ) )

    if ( !isValidOperation ) {
        return res.status ( 400 ).send ( 'Invalid Updates' )
    }

    try {

        const task = await Task.findByIdAndUpdate ( req.params.id, req.body, { new: true, runValidators: true } )
        if ( !task ) {
            return res.sendStatus ( 404 )
        }

        res.send ( task )

    } catch ( error ) {
        res.status ( 400 ).send ( error )
    }

} )

app.listen ( port, () => {
    console.log ( `Server is up running at port ${port}` )
} )