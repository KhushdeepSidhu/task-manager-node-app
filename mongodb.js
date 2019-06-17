const { MongoClient, ObjectID } = require ( 'mongodb' )

const connectionURL = 'mongodb://127.0.0.1:27017' 
const databaseName = 'task-manager-database'

MongoClient.connect ( connectionURL, { useNewUrlParser: true }, ( error, client ) => {

    if ( error ) {
        return console.log ( `Unable to connect to database - ${error}` )
    }

    const db = client.db ( databaseName )

    db.collection ( 'users' ).deleteMany ( { name: 'Arshdeep Sidhu' } ).then ( ( result ) => {
            console.log ( result.deletedCount )
        } ).catch ( ( error ) => {
            console.log ( error )
        } )

} )