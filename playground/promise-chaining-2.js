require ( '../src/db/mongoose' )
const Task = require ( '../src/models/task' )

const deleteTask = async ( id ) => {

    const task = await Task.findByIdAndDelete ( id )
    console.log ( task )
    return await Task.countDocuments ( { completed: false } )

}

deleteTask ( "5d083477c1bf3d15c9694762" ).then ( ( result ) => {
    console.log ( result )
} ).catch ( ( error ) => {
    console.log ( error )
} )

