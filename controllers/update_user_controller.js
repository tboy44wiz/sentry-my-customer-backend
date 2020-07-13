
const User = require("../models/store_admin");
const { body } = require('express-validator/check');
const bCrypt = require("bcryptjs");


exports.validate = (method) => {
    switch(method) {
      case 'body':
        return [
          body('old_password').isString(),
          body('new_password').isString().isLength({min: 6}).withMessage("Password must be 6 characters long")
        ];
  
    }
  }

module.exports.updatePassword = (req, res) => {

    const errorResponse = (err) => {
      return res.status(500).json({
        success: false,
        message: 'Error updating password',
        status: 500,
        error: {
          statusCode: 500,
          message: err.message
        }
      });
    }
  
    try {
  
      const { old_password, new_password } = req.body;
      const identifier = req.user.phone_number;
  
      User.findOne({ identifier })
        .then(user => {
  
          bCrypt.compare(old_password, user.local.password, function(err, result) {
            if(err) {
              return errorResponse(err);
            }
            if(!result) return errorResponse({message: "Passwords don't match"})
            bCrypt.hash(new_password, 10, (err, hash) => {
              user.local.password = hash;
  
              user.save()
                .then(result => {
                  res.status(200).json({
                    success: true,
                    message: "Password reset successful",
                    data: {
                        statusCode: 200,
                        message: "Password reset successful"
                    }
                  })
                })
                .catch(err => errorResponse(err))
            });
          })
  
        })
        .catch(err => errorResponse(err))
    } catch (error) {
      errorResponse(error);
    }
    
  }