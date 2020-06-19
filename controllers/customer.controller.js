
const Customer = require("../models/customer");

exports.create = async (req, res) => {// Validate request
    if(!req.body) {
        return res.status(400).send({
            status: "fail",
            message: "Transaction content can not be empty"
        });
    }

    const customer = new Customer({
        name: req.body.name,
        phone_number: req.body.phone
    });

    const result = await customer.save()

    res.status(200).json({
        status: "success",
        data: {
            id: customer._id,
            name: customer.name,
            phone: customer.phone_number
        }
    });
}

exports.getAll = async (req, res) => {
    try {
        let customers = await Customer.find().select("-__v").sort({
            createdAt: -1,
        });
        if (!customers) {
            return next(new Error("Something went wrong"));
        }
      
        res.status(200).json({
            status: "success",
            result: customers.length,
            data: customers,
        });
    } catch (error) {
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
};

