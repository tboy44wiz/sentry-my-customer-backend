const Store = require("./../models/store");
const UserModel = require("../models/store_admin");
const { body } = require('express-validator/check');

exports.validate = (method) => {
  switch (method) {
    case 'body': {
      return [
        body('store_name').isLength({ min: 3 }),
        body('shop_address').isLength({ min: 3 })
      ]
    }
  }
}

exports.createStore = async (req, res) => {
  try {
    const id = req.params.current_user;
    const storeOwner = await UserModel.findById(id);
    if (storeOwner) {
      const store = new Store({
        store_name: req.body.store_name,
        shop_address: req.body.shop_address,
        store_admin: id
      })
      await store.save();
      res.status(201).json({
        success: true,
        message: "Store added successfully",
        data: {
          statusCode: 201,
          store: store
        }
      })
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
        error:{
          code: 404,
          message: "User not found"
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error:{
        code: 400,
        message: error.message
      }
    });
  }
};

exports.getAllStores = async (req, res) => {
  //current user's id to find user
  const id = req.params.current_user;
  try {
    const store_admin = await UserModel.findById(id)
    if (!store_admin) {
      return res.status(404).json({
        success: false,
        message: error.message,
        error:{
          code: 400,
          message: error.message
        }
      });
    } else {
      const stores = await Store.find({store_admin: req.params.current_user});
      res.status(200).json({
        success: true,
        message: "Stores",
        data: {
          statusCode: 200,
          stores: stores
        }
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: {

      }
    });
  }
};

exports.getStore = async (req, res, next) => {
  try {
    const storeId = req.params.store_id;
    console.log(storeId);

    const store = await Store.findOne({ _id: storeId }).select("-__v");
    console.log(store);

    if (!store) {
      return res.status(404).json({
        status: "fail",
        message: "Store is not Found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        store,
      },
    });
  } catch (error) {
    res.status(200).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateStore = async (req, res, next) => {
  try {
    const store = await Store.findOneAndUpdate(req.params.store_id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        store,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteStore = async (req, res, next) => {
  console.log(req.params);

  try {
    const store = await Store.findOneAndRemove(
      req.params.store_Id,
      (error, data) => {
        if (error)
          res.status(404).json({
            status: "fail",
            message: error.message,
          });
      }
    );
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error,
    });
  }
};
