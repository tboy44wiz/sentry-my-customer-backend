
const Debt = require("../models/debt_reminders")
const Response = require('../util/response_manager')
const HttpStatus = require('../util/http_status')
const mongoose = require('mongoose')
const Transaction = require("../models/transaction")

exports.create = async (req,res)=>{
    // Add new message
    let transaction_id = req.body.transaction_id || req.params.transaction_id;
    let { phone_number } = req.user;
    const {customer_num,message,status,pay_date} = req.body

    if(!customer_num || !message || !status){
        return Response.failure(res, { error: true, message: 'customer numer,message and status is required.'}, HttpStatus.BAD_REQUEST);
    }

    try{
        const trans = await Transaction.findById(transaction_id);
        if(!trans){
            return Response.failure(res, { error: true, message: 'Transaction could not be found...'}, HttpStatus.NOT_FOUND);
        }

        const newDebt = new Debt({
                user_phone_number: phone_number,
                customer_phone_number: customer_num,
                ts_ref_id: trans._id,
                message: message,
                status: status,
                expected_pay_date: new Date(pay_date)
        })
        let debt = await newDebt.save();
        if(!debt){
            return Response.failure(res, { error: true, message: 'Debt reminder could not be created..'}, HttpStatus.NOT_IMPLEMENTED);
        }
        return Response.success(res, { error: false, message: 'Debt Reminder was created.'});
    }
    catch (err){
        return Response.failure(res, { error: true, message: err}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
        
}

exports.getAll = async (req,res)=>{
    // Find all the Debts
    const { phone_number } = req.user;
    try{
        const resp = await Debt.find({ user_phone_number : phone_number});
    if(!resp){
        return Response.failure(res, { error: true, message: "Debt not found", response: resp}, HttpStatus.NOT_FOUND)
    }
        return Response.success(res, { error: false, message: "Debt found",response: resp});
    }
    catch(err){ 
        return Response.failure(res, { error: true, message: err}, HttpStatus.INTERNAL_SERVER_ERROR); 
    }
}

exports.getById = async (req,res)=>{
    if(!req.params._id) return Response.failure(res, { error: true, message: "The following parameter "}, HttpStatus.NOT_FOUND)
    Debt.findById(req.params._id)
        .then(resp => {
            if(!resp) return Response.failure(res, { error: true, message: resp}, HttpStatus.NOT_FOUND)
            return Response.success(res, { error: false, message: resp})
        })
        .catch(err => { return Response.failure(res, { error: true, message: err}, HttpStatus.INTERNAL_SERVER_ERROR) })
}

exports.updateById = async (req, res) => {};

exports.deleteById = async (req, res) => {};
