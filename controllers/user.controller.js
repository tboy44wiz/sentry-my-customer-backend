const User = require('../models/user.js');

///#region Get all Users.
exports.all = (req, res) => {
    User.find({})
    .then(users => {
        res.send(users);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving the users."
        });
    });
};
//#endregion

//Add new user

exports.new = (req, res) =>{
    const phone_number = req.body.phone,
                first_name = req.body.firstname,
                last_name = req.body.lastname,
                email = req.body.email,
                password = req.body.password + "-this will be encrypted"

    const newUser = new User({
        phone_number: phone_number,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: password
    })
    User.create(newUser, (err, user)=>{
        if(err){
            res.status(503).json({
                status: "fail",
                message: "Could not add user due to an internal error"
            })
        }else{
            res.status(201).json({
                status: "success",
                data: user
            })
        }
    })
}

//#region Fnd a single user with a user_id
exports.getById = (req, res) => {
    User.findById(req.params.user_id)
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
else{
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
}};
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
