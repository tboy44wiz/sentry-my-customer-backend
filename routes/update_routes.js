const express = require('express');
const auth = require('../auth/auth');
const bodyValidator = require('../util/body_validator');
const Update = require('../controllers/update_user_controller');

const router = express.Router();

router.post('/password', auth, Update.validate('body'), bodyValidator, Update.updatePassword);


module.exports = router;