const express = require('express');
const passport = require('passport');
const { route } = require('.');
const router = express.Router();

// login auth with google (get : /auth/google)
router.get('/google', passport.authenticate('google', {scope: ['profile']}) )

// google with callback (get : /auth/google/callback)
router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/dashboard')
})

//@desc logout user (/auth/logout)
router.get('/logout', (req,res) => {
    req.logout()
    res.redirect('/')
})


module.exports = router