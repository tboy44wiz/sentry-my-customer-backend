module.exports = (app) => {
    const transactions = require('../controllers/transaction.controller.js');

    // Create a new Transaction
    app.post('/transaction/new', transactions.create);
    // Retrieve all Transactions
    app.get('/transaction/all', transactions.all);
    // Retrieve a single Transaction with transaction_id
    app.get('/transaction/getById/:transaction_id', transactions.getById);
    // Update a Transaction with transaction_id
    app.put('/transaction/update/:transaction_id', transactions.update);
    // Delete a Transaction with transaction_id
    app.delete('/transaction/delete/:transaction_id', transactions.delete);



}