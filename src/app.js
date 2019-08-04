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

const multer = require ( 'multer' )
const upload = multer ( {
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter( req, file, callback ) {
        if ( !file.originalname.match ( /\.(doc|docx)$/ ) ) {
            return callback ( new Error ( 'Please upload a Word document.' ) )
        }
        callback ( undefined, true )
    }
} )

app.post ( '/upload', upload.single ( 'upload' ), async ( req, res ) => {
    res.send()
} )



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