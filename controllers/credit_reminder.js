const UserModel = require("../models/store_admin");
const StoreModel = require("../models/store");
const Credit = require("../models/credit_reminders");
const Transaction = require("../models/transaction");

//  Create a Credit Reminder
exports.create = async (req,res)=> {
    // Add new message
    const identifier = req.user.phone_number;
    const {phone_number, store_name, transaction_id, message, status, pay_date} = req.body

    if (!phone_number || !store_name || !transaction_id || !message || !status || !pay_date) {
        return res.status(400).json({
            success: false,
            message: "phone_number, store_name, transaction_id, message and status are required.",
            data: {
                statusCode: 400,
                message: "phone_number, store_name, transaction_id, message and status are required.",
            },
        });
    }

    const newCredit = new Credit({
        user_phone_number: identifier,
        store_name: store_name,
        customer_phone_number: phone_number,
        ts_ref_id: transaction_id,
        message: message,
        status: status,
        expected_pay_date: pay_date,
    });

    UserModel.findOne({identifier})
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
                                            transaction.credits.push(newCredit);
                                           /* res.status(201).json({
                                                transaction: transaction,
                                            })*/
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
                            message: "Credit created",
                            data: {
                                details: newCredit,
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
        });
}

exports.getAll = async (req,res) => {
    // Find all the Credits
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
                                            Credits: credits,
                                        })
                                        if (credits.length > 0) {
                                            return res.status(200).json({
                                                success: true,
                                                message: "Credits retrieved successfully.",
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
        const creditResponse = await Credit.find({ user_phone_number : phone_number});
        if(!creditResponse){
            // TODO Find all the Credits attributed to this User
            return res.status(404).json({
                success: false,
                message: "Credit not found.",
                data: {
                    statusCode: 404,
                    message: "Credit not found.",
                },
            });
        }
        return res.status(200).json({
            success: true,
            message: "Credits found.",
            data: {
                statusCode: 200,
                message: "Credits found.",
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
            message: "Credit ID required.",
            data: {
                statusCode: 400,
                message: "Credit ID required.",
            },
        });
     }
    /*Credit.findById(creditId)
        .then((creditResponse) => {
            if(!creditResponse) {
                return res.status(404).json({
                    success: false,
                    message: "Credit not found.",
                    data: {
                        statusCode: 404,
                        message: "Credit not found.",
                    },
                });
            }
            return res.status(200).json({
                success: true,
                message: "Credit found.",
                data: {
                    statusCode: 200,
                    message: "Credit found.",
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
