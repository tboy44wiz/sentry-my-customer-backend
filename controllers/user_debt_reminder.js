const UserModel = require("../models/store_admin");
const StoreModel = require("../models/store");
const UserDebt = require("../models/user_debt_reminder");
const Transaction = require("../models/transaction");

//  Create a UserDebt Reminder
exports.create = async (req,res)=> {
    // Add new message
    const identifier = req.user.phone_number;
    const {distributor_store_name, total_amount, message, status, pay_date} = req.body

    if (!distributor_store_name || !total_amount || !message || !status || !pay_date) {
        return res.status(400).json({
            success: false,
            message: "distributor_store_name, total_amount, message, status and expected_pay_date are required.",
            data: {
                statusCode: 400,
                message: "distributor_store_name, total_amount, message, status and expected_pay_date are required.",
            },
        });
    }

    const newUserDebt = new UserDebt({
        user_phone_number: identifier,
        distributor_store_name: distributor_store_name,
        total_amount: total_amount,
        message: message,
        status: status,
        expected_pay_date: pay_date,
    });

    UserModel.findOne({identifier})
        .then((user) => {
            if (user) {
                user.user_debt.push(newUserDebt);

                user.save()
                    .then((userDebt) => {
                        res.status(201).json({
                            success: true,
                            message: "User's debt added successfully",
                            data: {
                                statusCode: 201,
                                user_debt: userDebt,
                            },
                        });
                    })
                    .catch((error) => {
                        res.send(error);
                    });
            }
        })
        .catch((error) => {
            res.status(400).json({
                success: false,
                message: error.message,
                error: {},
            });
        })

    /*UserModel.findOne({identifier})
        .then((user) => {
            const stores = user.stores;
            stores.forEach((store) => {
                if (store.store_name == store_name) {
                    customers = store.customers;
                    if (customers.length > 0) {
                        customers.forEach((customer) => {
                            if (customer.phone_number == phone_number) {
                                transactions = customer.transactions;
                                if (transactions.length > 0) {
                                    transactions.forEach((transaction) => {
                                        if (transaction._id == transaction_id) {
                                            transaction.credits.push(newUserDebt);
                                           /!* res.status(201).json({
                                                transaction: transaction,
                                            })*!/
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            });
            user.save()
                .then((result) => {
                    if (result) {
                        return res.status(201).json({
                            success: true,
                            message: "UserDebt created",
                            data: {
                                details: newUserDebt,
                            },
                        });
                    }
                    return res.status(417).json({
                        success: false,
                        message: "Unable to create credit.",
                        error: {
                            statusCode: 417,
                            message: "Unable to create credit.",
                        },
                    });
                })
                .catch((err) => {
                    return res.status(500).json({
                        success: false,
                        message:"Internal server error",
                        error: {
                            statusCode: 500,
                            message:"Internal server error",
                        },
                    });
                })
        })
        .catch((err) => {
            return res.status(500).json({
                status: false,
                message: "Internal server error",
                error: {
                    code: 500,
                    message: "Internal server error",
                },
            });
        });*/
}

exports.getAll = async (req,res) => {
    // Find all the UserDebts
    const identifier = req.user.phone_number;

    UserModel.findOne({identifier})
        .then((user) => {
            if (user) {
                const stores = user.stores;
                if (stores.length > 0) {
                    stores.forEach((store) => {
                        const customers = store.customers;
                        if (customers.length > 0) {
                            customers.forEach((customer) => {
                                const transactions = customer.transactions;
                                if (transactions.length > 0) {
                                    transactions.forEach((transaction) => {
                                        const credits = transaction.credits;
                                        res.json({
                                            UserDebts: credits,
                                        })
                                        if (credits.length > 0) {
                                            return res.status(200).json({
                                                success: true,
                                                message: "UserDebts retrieved successfully.",
                                                data: {
                                                    credits: credits,
                                                }
                                            })
                                        }
                                        return res.status(404).json({
                                            success: false,
                                            message: "No credit associated with this user.",
                                            data: {
                                                credits: credits,
                                            }
                                        })
                                    })
                                }
                            })
                        }
                    })
                }
            }
            else {
                return res.status(404).json({
                    status: false,
                    message: "User does not exit.",
                    error: {
                        code: 404,
                        message: "User does not exit.",
                    },
                });
            }
        })
        .catch((err) => {
            return res.status(500).json({
                status: false,
                message: "Internal server error",
                error: {
                    code: 500,
                    message: "Internal server error",
                },
            });
        });
    /*try{
        const creditResponse = await UserDebt.find({ user_phone_number : phone_number});
        if(!creditResponse){
            // TODO Find all the UserDebts attributed to this User
            return res.status(404).json({
                success: false,
                message: "UserDebt not found.",
                data: {
                    statusCode: 404,
                    message: "UserDebt not found.",
                },
            });
        }
        return res.status(200).json({
            success: true,
            message: "UserDebts found.",
            data: {
                statusCode: 200,
                message: "UserDebts found.",
                data: creditResponse,
            },
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err,
            data: {
                statusCode: 500,
                message: err,
            },
        });
    }*/
}

exports.getById = async (req,res) => {
    const creditId = req.params.customerId
    if(!creditId) {
        return res.status(400).json({
            success: false,
            message: "UserDebt ID required.",
            data: {
                statusCode: 400,
                message: "UserDebt ID required.",
            },
        });
     }
    /*UserDebt.findById(creditId)
        .then((creditResponse) => {
            if(!creditResponse) {
                return res.status(404).json({
                    success: false,
                    message: "UserDebt not found.",
                    data: {
                        statusCode: 404,
                        message: "UserDebt not found.",
                    },
                });
            }
            return res.status(200).json({
                success: true,
                message: "UserDebt found.",
                data: {
                    statusCode: 200,
                    message: "UserDebt found.",
                    data: creditResponse,
                },
            });
        })
        .catch((err) => {
            return res.status(500).json({
                success: false,
                message: err,
                data: {
                    statusCode: 500,
                    message: err,
                },
            });
        });*/
}

exports.updateById = async (req, res) => {};

exports.deleteById = async (req, res) => {};
