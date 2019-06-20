const mongoose = require ( 'mongoose' )
const validator = require ( 'validator' )
const bcrypt = require ( 'bcryptjs' )

// User schema to use middleware 
const userSchema = new mongoose.Schema ( {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate ( value ) {
            if ( !validator.isEmail ( value ) ) {
                throw new Error ( 'E-mail is invalid' )
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validate ( value ) {
            if ( value.toLowerCase().includes ( 'password' ) ){
                throw new Error ( 'Password must not contain the string "password"' )
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate ( value ) {
            if ( value < 0 ) {
                throw new Error ( 'Age must be a positive integer.' )
            }
        }
    }
} )

// Hash password before saving the user
userSchema.pre ( 'save', async function ( next ) {
    const user = this

    if ( user.isModified ( 'password' ) ) {
        user.password = await bcrypt.hash ( user.password, 8 )
    }

    next ()

} )

// Logging in users 
userSchema.statics.findByCredentials = async ( email, password ) => {

    const user = await User.findOne ( { email } )
    
    if ( !user ) {
        throw new Error ( 'Unable to login' )
    }

    const isMatch = await bcrypt.compare ( password, user.password )

    if ( !isMatch ) {
        throw new Error ( 'Unable to login' )
    }

    return user

}

// User model
const User = mongoose.model ( 'User', userSchema )

module.exports = User