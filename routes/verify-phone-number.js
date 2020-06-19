const express = require('express');
const router = express.Router();
const verifyController = require("./../controllers/verify-controller");

router.post('/auth/verify', verifyController.verifyPhone);
router.post('/auth/verify-phone', verifyController.initialverification);

module.exports = router
