const User = require("../models/store_admin");
const { body } = require('express-validator/check');
const bCrypt = require("bcryptjs");
const africastalking = require("africastalking")({
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: process.env.AFRICASTALKING_USERNAME
});

const makeid = require("../util/code_random");
const codeLength = 6;

exports.validate = (method) => {
  switch(method) {
    case 'body':
      return [
        body('old_password').isString(),
        body('new_password').isString().isLength({min: 6}).withMessage("Password must be 6 characters long")
      ];

  }
}


module.exports.recover = async (req, res) => {

  const userr = await new User({});
  userr.local.phone_number = req.body.phone_number;
  userr.local.password = req.body.password;
  userr.identifier = req.body.phone_number;

  User.findOne({ identifier: userr.identifier })
    .then(user => {
      if (!user)
        return res.status(401).json({
          message:
            "The phone number is not associated with any account. Double-check your phone number and try again."
        });

      //Generate and set password reset token
      user.generatePasswordReset();
      user.resetPasswordToken = makeid(codeLength, false);
      console.log(user.resetPasswordToken);

      // Save the updated user object
      user
        .save()
        .then(user => {
          res.status(200).json({
            success: true,
            message: "successful",
            data: {
              message: "successful",
              otp: user.resetPasswordToken,
            }
          });
          const sms = africastalking.SMS;
          sms
            .send({
              to: [`+${user.local.phone_number}`],
              message: `Your number verification to MyCustomer is ${user.resetPasswordToken}`
            })
            .then(response => {
              console.log(response);
              res.status(200).json({
                success: true,
                message: "successful",
                data: {
                  message: "Reset token sent successfully"
                }
              });
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({
                success: false,
                message: "Something went wrong.",
                otp: user.resetPasswordToken,
                data: {
                  statusCode: 500,
                  error: "Something went wrong."
                }
              });
            });
        })
        .catch(err => res.status(500).json({ message: err.message }));
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

module.exports.reset = async (req, res) => {
  User.findOne({
    resetPasswordToken: req.body.resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  })
    .then(user => {
      if (!user)
        return res
          .status(401)
          .json({ message: "Password reset token is invalid or has expired." });

      //Redirect user to form with the email address
      res.render("reset", { user });
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

module.exports.resetPassword = async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: { $gt: Date.now() }
  }).then(user => {
    if (!user)
      return res
        .status(401)
        .json({ message: "Password reset token is invalid or has expired." });
    return user;
  });

  //Set the new password
  user.local.password = req.body.password;
  user.local.password = await bCrypt.hash(user.local.password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  // Save
  user.save(err => {
    if (err)
      return res.status(500).json({
        success: false,
        message: "Something went wrong.",
        data: {
          statusCode: 500,
          error: "Something went wrong."
        }
      });
  });

  const sms = africastalking.SMS;
  sms
    .send({
      to: [`+${user.local.phone_number}`],
      message: `Your password has been successfully changed.`
    })
    .then(response => {
      console.log(response);
      res.status(200).json({
        success: true,
        message: "successful",
        data: {
          message: "successful"
        }
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Something went wrong.",
        data: {
          statusCode: 500,
          error: "Something went wrong."
        }
      });
    });
};



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