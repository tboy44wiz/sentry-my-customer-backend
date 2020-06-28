const express = require('express');
const LoginController = require('../controllers/login_controler');
const passport = require("passport");

const router = express.Router();

//User registration route
router.post('/user', LoginController.loginUser);

//Customer registration route
router.post('/customer', LoginController.loginCustomer);

//Sign in with facebook
router.get('/fb_login', passport.authenticate('facebook'));

router.get('/fb_return', passport.authenticate('facebook', { failureRedirect: '/docs' }),
    function (req, res) {
        res.status(200).send({
            success: true,
            message: "Login successful",
            data: {
                user: req.user._json
            }
        })
    }
)

module.exports = router;
