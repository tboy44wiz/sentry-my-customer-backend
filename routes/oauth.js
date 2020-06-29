const express = require('express');
const passport = require('passport');
const router = express.Router();

// @desc Auth with Google
// @router GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc Auth with callback
// @router GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/docs' }),
    (req, res) => {
        res.redirect('/')
    })

module.exports = router;
