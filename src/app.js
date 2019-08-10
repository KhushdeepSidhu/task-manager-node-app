const path = require ( 'path' )
const express = require ( 'express' )
require ( './db/mongoose' )
const userRouter = require ( './routers/user' )
const taskRouter = require ( './routers/task' )

const app = express ()

// Define paths
const publicDirPath = path.join ( __dirname, '../public' )

// Setup static directory to serve
app.use ( express.static ( publicDirPath ) )

// Parse incoming JSON into a JavaScript object which you can access on req.body. 
app.use ( express.json () )

// Register userRouter
app.use ( userRouter )

// Register task router
app.use ( taskRouter )

module.exports = app
