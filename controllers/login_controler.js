const jwt = require("jsonwebtoken");
const bCrypt = require("bcryptjs");
const { body } = require("express-validator/check");

const UserModel = require("../models/store_admin");
const CustomerModel = require("../models/customer");
const StoreAssistantModel = require('../models/storeAssistant');

exports.validate = (method) => {
  switch (method) {
    case "login": {
      return [body("phone_number").isInt(), body("password")];
    }
  }
};

//  Login User
module.exports.loginUser = async (req, res, next) => {
  const { password, phone_number } = req.body;

  //  Get instance of the
  const user = UserModel({});
  user.local.phone_number = phone_number;
  user.local.password = password;
  user.identifier = phone_number;

  //  Get instance of the StoreAssistantModel
  const newStoreAssistantData = new StoreAssistantModel({
    phone_number: phone_number,
    password: password,
  })

  //  Check if the users phone persists in the DB
  await UserModel.findOne({ identifier: phone_number })
    .then((userExist) => {
      if (userExist) {
        //  Go ahead to compare the password match.
        bCrypt
          .compare(user.local.password, userExist.local.password)
          .then((doPasswordMatch) => {
            if (doPasswordMatch) {
              //  Generate a login api_token for subsequent authentication.
              const apiToken = jwt.sign(
                {
                  phone_number: userExist.identifier,
                  password: user.local.password,
                  user_role: userExist.user_role,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "1h",
                }
              );
              userExist.api_token = apiToken;
              userExist.save();
              res.status(200).json({
                success: true,
                message: "You're logged in successfully.",
                data: {
                  statusCode: 200,
                  user: userExist,
                },
              });
            } else {
              res.status(401).json({
                success: false,
                message: "Invalid Password.",
                error: {
                  code: 401,
                  description: "Invalid Password",
                },
              });
            }
          })
          .catch((error) => {
            res.status(500).json({
              success: false,
              message: error,
              error: {
                code: 500,
                description: error,
              },
            });
          });
      }
      else {
          res.status(404).json({
            success: false,
            message: "User does not exist",
            error: {
              code: 404,
              description: "User does not exist",
            },
          });
        /*StoreAssistantModel.findOne({phone_number})
          .then((storeAssistant) => {
            if (storeAssistant) {

              //  Go ahead to compare the password match.
              bCrypt.compare(newStoreAssistantData.password, storeAssistant.password)
                .then((doPasswordMatch) => {
                  if (doPasswordMatch) {
                    //  Generate a login api_token for subsequent authentication.
                    const apiToken = jwt.sign({
                        phone_number: storeAssistant.phone_number,
                        password: storeAssistant.password,
                        adminIdentity: storeAssistant.admin_identity,
                        storeID: storeAssistant.store_id,
                        user_role: storeAssistant.user_role,
                      },
                      process.env.JWT_KEY,
                      {
                        expiresIn: "1h",
                      }
                    );
                    storeAssistant.api_token = apiToken;
                    storeAssistant.save();
                    res.status(200).json({
                      success: true,
                      message: "Logged in successfully.",
                      data: {
                        statusCode: 200,
                        user: storeAssistant,
                      },
                    });
                  }
                  else {
                    res.status(401).json({
                      success: false,
                      message: "Invalid Password.",
                      error: {
                        code: 401,
                        description: "Invalid Password",
                      },
                    });
                  }
                })
                .catch((error) => {
                  res.status(500).json({
                    success: false,
                    message: error,
                    error: {
                      code: 500,
                      description: error,
                    },
                  });
                });
            }
            else {
              res.status(404).json({
                success: false,
                message: "User does not exist",
                error: {
                  code: 404,
                  description: "User does not exist",
                },
              });
            }
          })
          .catch((error) => {
            res.status(500).json({
                Error: error,
            });
          });*/
      }  
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "An internal error occurred",
        error: {
          statusCode: 500,
          description: error,
        },
      });
    });
};

//  Login Customer
module.exports.loginCustomer = async (req, res, next) => {
  const { name, phone_number } = req.body;

  const reqBody = {
    phone_number: phone_number,
    name: name,
  };

  //Validate the "reqBody" object using joiValidator function imported.
  const { error, value } = await joiValidator.userLoginValidator.validate(
    reqBody
  );
  //  Check if there is any validation error.
  if (error) {
    return res.status(400).json({
      success: false,
      message: "An internal error occurred",
      error: {
        statusCode: 400,
        description: error.details[0].message,
      },
    });
  }

  //  Get instance of the
  const user = CustomerModel({
    name: value.name,
    phone_number: value.phone_number,
  });

  //  Check if the users phone persists in the DB
  await CustomerModel.findOne({ phone_number: user.phone_number })
    .then((userExist) => {
      if (userExist) {
        //  Go ahead to generate a login api_token for subsequent authentication..
        const apiToken = jwt.sign(
          {
            phone_number: userExist.phone_number,
            name: userExist.name,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          message: "You're logged in successfully.",
          api_token: apiToken,
          status: true,
          user: {
            _id: userExist._id,
            phone_number: userExist.phone_number,
            name: userExist.name,
          },
        });
      } else {
        res.json({
          message: "Invalid phone number.",
          Status: false,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        Error: error,
      });
    });
};

module.exports.login;
