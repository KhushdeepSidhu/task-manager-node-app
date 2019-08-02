const mongoose = require ( 'mongoose' )
const validator = require ( 'validator' )
const bcrypt = require ( 'bcryptjs' )
const jwt = require ( 'jsonwebtoken' )
const Task = require ( './task' )

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
    },
    tokens: [ {
        token: {
            type: String,
            required: true
        }
    } ]
}, {
    timestamps: true    
} )

// User-Task relationship
userSchema.virtual ( 'tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
} )

// Hash password before saving the user
userSchema.pre ( 'save', async function ( next ) {
    const user = this

    if ( user.isModified ( 'password' ) ) {
        user.password = await bcrypt.hash ( user.password, 8 )
    }

    next ()

} )

// Delete tasks before removing a user 
userSchema.pre ( 'remove', async function ( next ) {

    const user = this 
    await Task.deleteMany ( { owner: user._id } )

    next()

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

// Hide private data
userSchema.methods.toJSON = function () {

    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject

}

// generate authentication token
userSchema.methods.generateAuthToken = async function () {

    const user = this 
    const token = jwt.sign ( { _id: user._id.toString () }, 'thisismynewcourse' )
    user.tokens = user.tokens.concat ( { token } )
    await user.save ()

    return token
}

// User model
const User = mongoose.model ( 'User', userSchema )

module.exports = User