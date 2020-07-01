const Store = require("../models/store")
const Customer = require("../models/customer")
const { body } = require('express-validator/check');

exports.validate = (method) => {
  switch (method) {
    case 'body': {
      return [
        body('name').isLength({ min: 3 }),
        body('store_id').isLength({ min: 3 }),
        body('phone_number').optional().isInt(),
        body('email').optional().isEmail()
      ]
    }
    case 'getAll': {
      return [
        body('store_id').isLength({ min: 3 })
      ]
    }
  }
}

exports.create = async (req, res) => {
  Store.findOne({_id: req.body.store_id, store_admin: req.params.current_user}).catch(err =>{
    res.status(404).json({
      status: false,
      message: "Store not found",
      error: {
        code: 404,
        message: "Store not found"
      },
    });
  }).then( async store => {
    console.log(store)
    if(store) {
      const customer = new Customer({
        name: req.body.name,
        store: req.body.store_id
      })
      await customer.save()
      res.status(201).json({
        success: true,
        message: "Customer added successfully",
        data: {
          statusCode: 201,
          customer: customer
        }
      })
    }
    res.status(404).json({
      status: false,
      message: "Store not found",
      error: {
        code: 404,
        message: "Store not found"
      },
    });
  })
};

exports.getById = (req, res) => {
  try {
    Customer.findById(req.params.customerId, (error, customer) => {
      if (error) {
        res.status(404).send({
          status: false,
          message: error.message,
          error: {
            code: 404,
            message: error.message
          }
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Customer was found",
          data: {
            customer
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      error: {
        code: 500,
        message: error.message
      }
    });
  }
};

exports.updateById = (req, res) => {
  Customer.updateOne({ _id: req.params.customerId }, { $set: {
    name: req.body.name,
    phone_number: req.body.phone,
  }})
    .exec()
    .then((result) => {
      res.status(200).json({
        status: true,
        message: "Customer was updated",
        data: {
          customer: {
            id: req.params.customerId,
            name: req.body.name,
            phone: req.body.phone,
          }
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error.message,
        error: {
          code: 500,
          message: error.message
        }
      });
    });
};

exports.deleteById = (req, res) => {
  try {
    Customer.findByIdAndDelete(req.params.customerId, (error, customer) => {
      if (error) {
        res.status(404).json({
          status: false,
          //message: error.message,
        });
      } else if (!customer) {
        res.status(404).json({
          status: false,
          message: "Customer not found",
          error: {
            code: 404,
            message: "Customer not found"
          }
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Customer was deleted",
          data: {
            customer: {
              id: customer._id,
              name: customer.name,
              phone: customer.phone_number,
            }
          },
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      error: {
        code: 500,
        message: error.message
      }
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    Store.findOne({_id: req.body.store_id, store_admin: req.params.current_user}).catch(err =>{
      res.status(404).json({
        status: false,
        message: "Store not found",
        error: {
          code: 404,
          message: "Store not found"
        },
      });
    }).then( async store => {
      if(store) {
        let customers = await Customer.find({store: req.body.store_id}).select("-__v").sort({
          createdAt: -1,
        });
        if (!customers) {
          res.status(404).json({
            status: false,
            message: "Customers not found",
            error: {
              code: 404,
              message: "Customers not found"
            }
          });
        }

        res.status(200).json({
          status: true,
          message: "Customers",
          data: {
            customers: customers
          }
        });
      }
      res.status(404).json({
        status: false,
        message: "Store not found",
        error: {
          code: 404,
          message: "Store not found"
        },
      });
    })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      error: {
        code: 500,
        message: error.message
      }
    });
  }
};
