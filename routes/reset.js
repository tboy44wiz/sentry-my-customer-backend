const express = require('express');
const Reset = require("../controllers/reset.controller.js");
const auth = require('../auth/auth');
const bodyValidator = require('../util/body_validator');

const router = express.Router();

router.post('/recover', Reset.recover);

router.post('/reset', Reset.resetPassword);

router.post('/update/password', auth, Reset.validate('body'), bodyValidator, Reset.updatePassword);

module.exports = router;
