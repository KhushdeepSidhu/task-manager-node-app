const jwt = require ( 'jsonwebtoken' )

const token = jwt.sign ( { _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days' })

const data = jwt.verify ( token, 'thisismynewcourse' )

console.log ( data )