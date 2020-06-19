const User = require('../models/user.js');

//#region  Create new User
exports.create = (req, res) => {
    // Validate request
    if(!req.body.content) {
        return res.status(400).send({
            message: "User Info content can not be empty"
        });
    }
 
    const user = new User({
        phone_number: req.body.phone_number,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        is_active: req.body.is_active,
        password: req.body.password,
        api_token: req.body.api_token,
        user_role: req.body.user_role
    });

    // Save the user in the database
    user.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Transaction."
        });
    });
};
//#endregion

//#region Get all Users.
exports.all = (req, res) => {
    User.find()
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving transactions."
        });
    });
};
//#endregion

//#region Fnd a single user with a user_id
exports.getById = (req, res) => {
    User.findById(req.params.user_id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });            
        }
        res.send(transaction);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.user_id
        });
    });
};
//#endregion

//#region Update a user the user_id 
exports.update = (req, res) => {
    // Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Transaction content can not be empty"
        });
    }

    // Find transaction and update it with the request body
    User.findByIdAndUpdate(req.params.user_id, {
        phone_number: req.body.phone_number,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        is_active: req.body.is_active,
        password: req.body.password,
        api_token: req.body.api_token,
        user_role: req.body.user_role
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });                
        }
        return res.status(500).send({
            message: "Error updating user with id " + req.params.user_id
        });
    });
};
//#endregion

//#region Delete a user the user_id
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.user_id)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });
        }
        res.send({message: "User deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "User not found with id " + req.params.user_id
            });                
        }
        return res.status(500).send({
            message: "Could not delete user with id " + req.params.user_id
        });
    });
};
//#endregion