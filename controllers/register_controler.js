const jwt = require("jsonwebtoken");
const bCrypt = require('bcryptjs');

const UserModel = require('../models/user');
const CustomerModel = require('../models/customer');

//  Register User
module.exports.registerUser = async (req, res, next) => {
    try {
		const { email, first_name, is_active, last_name, password, phone_number, user_role } = req.body;

    //  Create a Token that will be passed as the "api_token"
    const apiToken = await jwt.sign({
        phone_number: phone_number,
        email: email,
        user_role: user_role,
    }, process.env.JWT_KEY, {
        expiresIn: "1d",
    });


    //  Get instance of the
    const user = new UserModel({
        phone_number: phone_number,
        first_name: first_name,
        last_name: last_name,
        email: email,
        is_active: is_active,
        password: password,
        api_token: apiToken,
        user_role: user_role,
    });
    //  Encrypt the Password
    user.password = await bCrypt.hash(user.password, 12);


    //  Check if User PhoneNumber and Email already exist.
    await UserModel.findOne({ phone_number: user.phone_number, email: user.email })
        .then((existingUser) => {
            if(existingUser) {
                //  This means the user exists.
                return res.status(200).json({
                    Message: "Email or phone number already taken. Please use another email or phone number."
                });
            }
            else {
                //  Save to the DB.
                user.save()
                    .then((result) => {
                        res.status(201).json({
                            Message: "User registered successfully...",
                            User: {
                                _id: result._id,
                                phone_number: result.phone_number, 
                                first_name: result.first_name, 
                                last_name: result.last_name, 
                                email: result.email, 
                                is_active: result.is_active, 
                                password: result.password, 
                                api_token: result.api_token, 
                                user_role: result.user_role,
                            },
                        });

                        //  TODO Redirect to the OTP Activation Page.
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            Error: error,
                        });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({
                Error: error,
            });
        });
	} catch (error) {
    res.status(500).send({
      status: "fail",
      message: error.message || "Some error occurred while creating the transaction.",
    });
  }
};


//  Register Customer
module.exports.registerCustomer = async (req, res, next) => {
    const { name, phone_number } = req.body;


    //  Get instance of the
    const customer = new CustomerModel({
        name: name,
        phone_number: phone_number,
        /*store_ref_code: store_ref_code,*/
    });
    console.log(`USER_DETAIL::: ${customer}`);

    //  Check if User PhoneNumber already exist.
    await UserModel.findOne({ phone_number: customer.phone_number })
        .then((existingUser) => {
            if(existingUser) {
                //  This means the user exists.
                return res.status(200).json({
                    Message: "Phone number already taken. Please use another phone number."
                });
            }
            else {
                //  Save to the DB.
                customer.save()
                    .then((result) => {
                        return res.status(201).json({
                            Message: "Customer registered successfully...",
                            Customer: {
                                _id: result._id,
                                name: result.name,
                                phone_number: result.phone_number,
                                store_ref_code: result.store_ref_code,
                            },
                        });
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            Error: error,
                        });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({
                Error: error,
            });
        });
};
