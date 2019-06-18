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
app.post ( '/users', ( req, res ) => {
    const user = new User ( req.body )

    // Save to mongodb database
    user.save().then ( ( user ) => {
        res.status ( 201 ).send ( user )
    } ).catch ( ( error ) => {
        res.status ( 400 ).send ( error )
    } )

} )

// HTTP end point to create a task
app.post ( '/tasks', ( req, res ) => {
    const task = new Task ( req.body )

    task.save ().then ( ( task ) => {
        res.status( 201 ).send ( task )
    } ).catch ( ( error ) => {
        res.status( 400 ).send ( error )
    } )
} )

app.listen ( port, () => {
    console.log ( `Server is up running at port ${port}` )
} )