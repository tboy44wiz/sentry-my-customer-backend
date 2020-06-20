<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const user_ctroll = require("./../controllers/user_ctroll.js");

// router.get('/user', user_ctroll.getUser)
router.put('/user/edit', user_ctroll.updateUser)

module.exports = router
=======

    const express = require('express');
    const router = express.Router();
    
    const users = require('../controllers/user.controller.js');

    

   // Retrieve all Users
   router.get('/user/all', users.all);

    // Retrieve a single User with user_id
    router.get('/user/:user_id', users.getById);

   // Update User Info with user_id
   router.put('/user/update/:user_id', users.update);

    // Delete a User with user_id
    router.delete('/user/delete/:user_id', users.delete);

    module.exports = router;
>>>>>>> upstream/develop
