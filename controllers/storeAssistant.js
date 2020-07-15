const StoreAssistantModel = require('../models/storeAssistant');
const UserModel = require("../models/store_admin");

exports.createStoreAssistant = (req, res, next) => {
    const { phone_number, name } = req.body;
    const id = req.user.phone_number;

    const newStoreAssistantData = {
        name: name,
        phone_number: phone_number,
    }

    if (!phone_number || !name) {
        return res.status(400).json({
            success: false,
            message: "phone_number and name cannot be empty.",
            data: {
                status: 400,
                message: "phone_number and name cannot be empty.",
            },
        });
    }

    UserModel.findOne({identifier: id})
        .then((user) => {
            const stores = user.stores;
            res.status(200).json({
               Stores: stores,
            });
        })
        .catch((error) => {
            res.status(500).json({
                Error: error,
            })
        })

}