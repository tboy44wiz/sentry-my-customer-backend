const express = require('express');

const router = express.Router();

const SearchController = require('../controllers/search-users')

//Maintain the endpoint naming convention
router.get('/searchUsers', SearchController.findAll);

module.exports  = router;