module.exports = (app) => {
    const users = require('../controllers/user.controller.js');

    // Create a new User
    app.post('/user/new', users.create);

    // Retrieve all Transactions
    app.get('/user/all', users.all);

    // Retrieve a single Transaction with transaction_id
    app.get('/user/:user_id', users.getById);

    // Update a Transaction with transaction_id
    app.put('/user/update/:user_id', users.update);

    // Delete a Transaction with transaction_id
    app.delete('/user/delete/:user_id', users.delete);
}
