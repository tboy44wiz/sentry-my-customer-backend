const express = require('express');
const router = express.Router();
const messageController = require("../controllers/messageController");

router.post('/reminder/sms/:customer_id', messageController.sendMessage);

module.exports = router;
