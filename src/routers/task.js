const express = require ( 'express' )
const Task = require ( '../models/task' )

const router = new express.Router ()

// HTTP end point to create a task
router.post ( '/tasks', async ( req, res ) => {

    const task = new Task ( req.body )

    try {
        await task.save ()
        res.status( 201 ).send ( task )
    } catch ( error ) {
        res.status( 400 ).send ( error )
    }

} )

// HTTP end point to read multiple tasks
router.get ( '/tasks', async ( req, res ) => {

    try {

        const tasks = await Task.find ( {} )
        if ( !tasks.length ) {
            return res.sendStatus ( 404 )
        }
        res.send ( tasks )

    } catch ( error ) {
        res.status ( 500 ).send ( error )
    }

} )

// HTTP end point to read a task
router.get ( '/tasks/:id', async ( req, res ) => {

    const _id = req.params.id

    try {
        const task = await Task.findById ( _id )
        if ( !task ) {
            return res.sendStatus ( 404 )
        }
        res.send ( task )

    } catch ( error ) {
        res.status ( 500 ).send ( error )
    }

} )

// HTTP end point to update a task
router.patch ( '/tasks/:id', async ( req, res ) => {

    const updates = Object.keys ( req.body )
    const allowedUpdates = [ 'description', 'completed' ]
    const isValidOperation = updates.every ( ( update ) => allowedUpdates.includes ( update ) )

    if ( !isValidOperation ) {
        return res.status ( 400 ).send ( 'Invalid Updates' )
    }

    try {

        const task = await Task.findByIdAndUpdate ( req.params.id, req.body, { new: true, runValidators: true } )
        if ( !task ) {
            return res.sendStatus ( 404 )
        }

        res.send ( task )

    } catch ( error ) {
        res.status ( 400 ).send ( error )
    }

} )

// HTTP end point to delete a task
router.delete ( '/tasks/:id', async ( req, res ) => {

    try {
        const task = await Task.findByIdAndDelete ( req.params.id )
        if ( !task ) {
            return res.sendStatus ( 404 )
        }

        res.send ( task )
    } catch ( error ) {
        res.sendStatus ( 500 )
    }

} )

module.exports = router