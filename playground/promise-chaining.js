require ( '../src/db/mongoose' )
const User = require ( '../src/models/user' )

const updateUser = async ( id, update ) => {

    const user = await User.findByIdAndUpdate ( id, update )
    console.log ( user )
    return await User.countDocuments ( update )

}

updateUser ( "5d091da57ecc824b2cfd83f2", { age: 33 } ).then ( ( result ) => {
    console.log ( result )
} ).catch ( ( error ) => {
    console.log ( error )
} )