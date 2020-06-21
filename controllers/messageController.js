const Response = require('../util/response_manager');
const HttpStatus = require('../util/http_status');
const express = require('express');

const router = express.Router();

router.use(require("body-parser").urlencoded({
    extended: true
}));
const messagebird = require('messagebird')('S2LorOevmKnSHrcS9KBXnVXyq');//4505 test
// const messagebird = require('messagebird')('jXFk6Krvh8Lw24Xn1Kw0XjX4M');//production

module.exports = {
        sendMessage(req, res) {
            //NOTE: both keys can only work with +2348145502505
            try {
                const recipient = '+2348145502505';
                const message = req.body.message
                var params = {
                    'originator': 'MyCustomer',
                    'recipients': [
                        recipient
                    ],
                    'body': "Dear MyCustomer, please note that your outstanding payment of 2 cups of beans is due for Thursday, 10/11/2528. Thank you."
                };
                messagebird.messages.create(params, (err, response) => {
                    if (err) {
                        res.status(err.statusCode).json({
                            status: "Bad request",
                            message: err
                        });
                    } else {
                        res.status(200).json({
                            status: "sucess",
                            message: response
                        })
                    }
                })
            } catch (e) {

            }
        }
    }
