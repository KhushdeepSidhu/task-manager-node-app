const express = require ( 'express' )
const auth = require ( '../middleware/auth' )
const Task = require ( '../models/task' )

const router = new express.Router ()

// HTTP end point to create a task
router.post ( '/tasks', auth, async ( req, res ) => {

    const task = new Task ( {
        ...req.body,
        owner: req.user._id
    } )

    try {
        await task.save ()
        res.status( 201 ).send ( task )
    } catch ( error ) {
        res.status( 400 ).send ( error )
    }

} )

// HTTP end point to read multiple tasks
// GET tasks?completed=true
// GET tasks?limit=2&&skip=2
router.get ( '/tasks', auth, async ( req, res ) => {

    const match = {}
    const sort = {}

    if ( req.query.completed ) {
        match.completed = req.query.completed === 'true'
    }

    if ( req.query.sortBy ) {
        const parts = req.query.sortBy.split( ':' )
        sort[ parts[0] ] = parts[1] === 'desc' ? -1 : 1
    }

    try {

        await req.user.populate( {
            path: 'tasks',
            match,
            options: {
                limit: parseInt( req.query.limit ),
                skip: parseInt( req.query.skip ),
                sort
            }
        } ).execPopulate()
        if ( !req.user.tasks.length ) {
            return res.sendStatus ( 404 )
        }
        res.send ( req.user.tasks )

    } catch ( error ) {
        res.status ( 500 ).send ( error )
    }

} )

// HTTP end point to read a task
router.get ( '/tasks/:id', auth, async ( req, res ) => {

    const _id = req.params.id

    try {
        const task = await Task.findOne ( { _id, owner: req.user._id } )
        if ( !task ) {
            return res.sendStatus ( 404 )
        }
        res.send ( task )

    } catch ( error ) {
        res.status ( 500 ).send ( error )
    }

} )

// HTTP end point to update a task
router.patch ( '/tasks/:id', auth, async ( req, res ) => {

    const updates = Object.keys ( req.body )
    const allowedUpdates = [ 'description', 'completed' ]
    const isValidOperation = updates.every ( ( update ) => allowedUpdates.includes ( update ) )

    if ( !isValidOperation ) {
        return res.status ( 400 ).send ( 'Invalid Updates' )
    }

    try {

        const task = await Task.findOne ( { _id: req.params.id, owner: req.user._id } )
        if ( !task ) {
            return res.sendStatus ( 404 )
        }

        updates.forEach ( ( update ) => task [ update ] = req.body [ update ] )
        const savedTask = await task.save ()
        res.send ( savedTask )

    } catch ( error ) {
        res.status ( 400 ).send ( error )
    }

} )

// HTTP end point to delete a task
router.delete ( '/tasks/:id', auth, async ( req, res ) => {

    try {
        const task = await Task.findOneAndDelete ( { _id: req.params.id, owner: req.user._id } )
        if ( !task ) {
            return res.sendStatus ( 404 )
        }

        res.send ( task )
    } catch ( error ) {
        res.sendStatus ( 500 )
    }

} )

module.exports = router