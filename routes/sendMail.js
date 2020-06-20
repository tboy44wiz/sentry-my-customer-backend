const express = require('express');
const router = express.Router();
const emailController = require("./../controllers/emailController");

router.post('/reminder/email/:customer_id', emailController.sendMail);

module.exports = router
