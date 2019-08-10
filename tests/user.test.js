const request = require ( 'supertest' )
const app = require ( '../src/app' )
const User = require ( '../src/models/user' )
const { userOneId, userOne, setupDatabase } = require ( './fixtures/db' )

beforeEach ( setupDatabase )

test ( 'Should sign up a user', async () => {
    const response = await request ( app ).post ( '/users' ).send ( {
        name: 'Khushdeep Sidhu',
        email: 'khushdeep009@gmail.com',
        password: 'Mypass777!'
    } ).expect ( 200 )

    // Assert that the database was changed correctly
    const user = await User.findById ( response.body.savedUser._id )
    expect ( user ).not.toBeNull ()

    // Assertions about the response body
    expect ( response.body ).toMatchObject ( {
        savedUser: {
            name: 'Khushdeep Sidhu',
            email: 'khushdeep009@gmail.com'
        },
        token: user.tokens[0].token
    } )

    // Assertion about the password
    expect ( user.password ).not.toBe ( 'Mypass777!' )
} )

test ( 'Should login existing user', async () => {
    const response = await request ( app ).post ( '/users/login' ).send ( {
        email: userOne.email,
        password: userOne.password
    } ).expect ( 200 )

    // Assertion to validate new token is saved in the tokens array
    const user = await User.findById ( response.body.user._id )
    expect ( response.body.token ).toBe ( user.tokens[1].token )
} )

test ( 'Should not login non existing user', async () => {
    await request ( app ).post ( '/users/login' ).send ( {
        email: 'JattBoy@example.com',
        password: '234dkmcldkm'
    } ).expect ( 400 )
} ) 

test ( 'Should read user profile', async () => {
    await request ( app )
        .get ( '/users/me' )
        .set ( 'Authorization', `Bearer ${userOne.tokens[0].token}` )
        .send ()
        .expect ( 200 )
} )

test ( 'Should not get profile for unauthenticated user', async () => {
    await request ( app )
        .get ( '/users/me' )
        .send ()
        .expect ( 401 )
} )

test ( 'Should delete account for authenticated user', async () => {
    const response = await request ( app )
        .delete ( '/users/me' )
        .set ( 'Authorization', `Bearer ${userOne.tokens[0].token}` )
        .send ()
        .expect ( 200 )
    
    // Assertion that the user no longer exists in the database
    const user = await User.findById ( response.body.user._id )
    expect ( user ).toBeNull ()
} )

test ( 'Should not delete account for unauthenticated user', async () => {
    await request ( app )
        .delete ( '/users/me' )
        .send ()
        .expect ( 401 )
} )

test ( 'Should upload avatar image', async () => {
    await request ( app )
        .post ( '/users/me/avatar' )
        .set ( 'Authorization', `Bearer ${userOne.tokens[0].token}` )
        .attach ( 'avatar', './tests/fixtures/profile-pic.jpg' )
        .expect ( 200 )
    const user = await User.findById ( userOneId )
    expect ( user.avatar ).toEqual ( expect.any ( Buffer ) )
} )

test ( 'Should update valid user fields', async () => {
    await request ( app )
        .patch ( '/users/me' )
        .set ( 'Authorization', `Bearer ${userOne.tokens[0].token}` )
        .send ( {
            name: 'MikeNew',
            email: 'mikenew@examle.com'
        } )
        .expect ( 200 )

    // Assertion that the data has changed correctly in the database
    const user = await User.findById ( userOneId )
    expect ( user ).toMatchObject ( {
        name: 'MikeNew',
        email: 'mikenew@examle.com'
    } )
        
} )

test ( 'Should not update invalid user fields', async () => {
    await request ( app )
    .patch ( '/users/me' )
    .set ( 'Authorization', `Bearer ${userOne.tokens[0].token}` )
    .send ( {
        location: 'Vaudreuil-Dorion'
    } )
    .expect ( 400 )
} )