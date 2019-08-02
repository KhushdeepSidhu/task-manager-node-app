const path = require ( 'path' )
const express = require ( 'express' )
require ( './db/mongoose' )
const userRouter = require ( './routers/user' )
const taskRouter = require ( './routers/task' )

const app = express ()

// Define paths
const publicDirPath = path.join ( __dirname, '../public' )

// configure port to make the application on heroku also
const port = process.env.PORT || 3000

// Setup static directory to serve
app.use ( express.static ( publicDirPath ) )

// Parse incoming JSON into a JavaScript object which you can access on req.body. 
app.use ( express.json () )

// Register userRouter
app.use ( userRouter )

// Register task router
app.use ( taskRouter )

app.listen ( port, () => {
    console.log ( `Server is up running at port ${port}` )
} )


// User - Task relationship
const Task = require( './models/task' )
const User = require ( './models/user' )

const main = async () => {
    // const task = await Task.findById( '5d4191325d6d41308810efc9' )
    // await task.populate ( 'owner' ).execPopulate()
    // console.log ( task.owner )
    const user = await User.findById ( '5d4105e304884345f4f778ce' )
    await user.populate ( 'tasks' ).execPopulate()
    console.log ( user.tasks )

}

main ()