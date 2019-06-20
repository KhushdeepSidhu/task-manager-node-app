const bcrypt = require ( 'bcryptjs' )

const doWork = async () => {

    const password = 'Red12345!'

    try {
        const hashedPassword = await bcrypt.hash ( password, 8 )
        const isMatch = await bcrypt.compare ( 'Red12345!', hashedPassword )
        console.log ( isMatch )
    } catch ( error ) {
        console.log ( error )
    }

}

doWork ()


