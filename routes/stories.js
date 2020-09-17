const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Story = require('../models/Story')

// show add page (get : /stories/add)
router.get('/add', ensureAuth, (req,res) => {
    res.render('stories/add')
})

// show stories (get : /stories)
router.get('/', ensureAuth, async (req,res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({createdAt: 'desc'})
            .lean()

        res.render('stories/index', {
            stories,
        })
    }
    catch (err)
    {
        console.log(err)
        res.render('error/500')
    }
})

// show story (get : /stories/:id)
router.get('/:id', ensureAuth, async (req,res) => {
    try {
        let story = await Story.findById(req.params.id)
            .populate('user')
            .lean()

        if(!story)
        {
            res.render('error/404')
        }

        res.render('stories/show', {
            story
        })
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

// post add from (post : /stories)
router.post('/', ensureAuth, async (req,res) => {
    try {
        req.body.user = req.user.id
        //console.log(req.body)
        await Story.create(req.body)
        //console.log(stories);
        res.redirect('/dashboard')
    } 
    catch(err) 
    {
        console.log(err)
        res.render('error/500')
    }
})

// show edit page (get : /stories/edit/:id)
router.get('/edit/:id', ensureAuth, async (req,res) => {

    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
    
        if(!story) {
            return res.render('error/404')
        }
    
        if(story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            //console.log(story)
            res.render('stories/edit', {
                story,
            })
        }
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

// update story (put : /stories/:id)
router.put('/:id', ensureAuth, async (req,res) => {

    try {
        let story = await Story.findById(req.params.id).lean()

        if(!story) {
            return res.render('error/404')
        }
    
        if(story.user!=req.user.id) {
            res.redirect('/stories')
        } else  {
            story = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
                new: true,
                runValidators: true,
            })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

// delete story (delete : /stories/:id)
router.delete('/:id', ensureAuth, async (req,res) => {
    try {
        await Story.remove({_id: req.params.id})
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        return res.render('error/500')
    }
})

// user stories (get : /stories/user/:userid)
router.get('/user/:userId', ensureAuth, async (req,res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})

module.exports = router