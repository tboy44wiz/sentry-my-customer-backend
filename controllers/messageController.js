const Response = require('../util/response_manager');
const HttpStatus = require('../util/http_status');
const express = require('express');

const router = express.Router();

router.use(require("body-parser").urlencoded({
    extended: true
}));
const messagebird = require('messagebird')('PRpFg1JwvolNubJ3XRnSRGtP0');

module.exports = {
        sendMessage(req, res) {
            try {
                const recipient = req.body.phone
                const message = req.body.message
                messagebird.verify.verify(id, token, (err, response) => {
                    if (err) {
                        res.status(err.statusCode).json({
                            status: "Bad request",
                            message: err.errors[0].description
                        });
                    } else {
                        res.status(200).json({
                            status: "sucess",
                            message: "Phone number verification successful"
                        })
                    }
                })
            } catch (e) {

            }
        }
    }
