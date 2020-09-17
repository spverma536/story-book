const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const Story = require('../models/Story')

// login landing page (get : /)
router.get('/', ensureGuest, (req,res) => {
    res.render('login', {
        layout: 'login'
    })
})

// login landing page (get : /)
router.get('/video_call', ensureAuth, async (req,res) => {
    console.log(5)
    await res.render('video_call')
})

// dashboard page (get : /dashboard)
router.get('/dashboard', ensureAuth, async (req,res) => {
    //console.log(req.user)

    try{
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            name: req.user.firstName,
            photo: req.user.image,
            stories
        })
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})


module.exports = router