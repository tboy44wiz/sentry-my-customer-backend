module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/user/new', users.create);

   // Retrieve all Users
    app.get('/user/all', users.all);

    // Retrieve a single User with user_id
    app.get('/user/:user_id', users.getById);

   // Update User Info with user_id
    app.put('/user/update/:user_id', users.update);

    // Delete a User with user_id
    app.delete('/user/delete/:user_id', users.delete);
}
