const Response = require('../util/response_manager'),
            HttpStatus = require('../util/http_status'),
            express = require('express'),
            nodemailer = require('nodemailer'),
            Customer = require("../models/customer");


const router = express.Router();

router.use(require("body-parser").urlencoded({extended: true}));

module.exports = {
    sendMail(req, res){
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'melijah200@gmail.com',
                pass: 'emailpasswordgoeshere'
            }
        });

        //Find a customer and get the email
        const id = req.params.customer_id;
        Customer.findById(id, (err, foundCustomer)=>{
            if(err){
                res.status(404).json({
                    status: "fail",
                    message: "Customer not found"
                });
            }else{
                if(foundCustomer.email != "" || undefined){
                    const recipient = foundCustomer.email,
                        subject = req.body.subject,
                        text = req.body.text;

                    const params = {
                        from: 'melijah200@gmail.com',
                        to: 'melijah200@yahoo.com',
                        subject: 'Sending Email using Node.js',
                        text: 'That was easy!'
                    };

                    transporter.sendMail(params, function (error, info) {
                        if (error) {
                            console.log(error);
                            res.status(401).json({
                                status: "Bad request",
                                message: error
                            })
                        } else {
                            console.log('Email sent: ' + info.response);
                            res.status(200).json({
                                status: "success",
                                message: info
                            })
                        }
                    });
                }
            }
        })
    }
}
