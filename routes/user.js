const express = require('express');
const router = express.Router();
const user_ctroll = require("./../controllers/user_ctroll.js");

// router.get('/user', user_ctroll.getUser)
router.put('/user/edit', user_ctroll.updateUser)

module.exports = router