const Complaint = require("../models/complaint_form");
// const User = require("../models/user");

const StoreOwner = require('../models/store_admin');
const { check, validationResult } = require('express-validator/check');


// @route       GET /complaint/all
// @desc        Store admin retrieves all Complaints
// @access      Private
exports.findAll = async (req, res) => {
  
  // Finds all complaints pertaining to store owner
  
};

// update complaint
exports.update = async (req, res) => {
  // validating the message
  if (!req.body.message || "") {
    return res.status(404).send({
      status: false,
      message: "Message field canot be empty",
      data: {
        message: "Message field canot be empty"
      }
    });
  }

  try {
    // update complaint
    let complaint = await Complaint.findByIdAndUpdate(req.params.id, {
      message: req.body.message,
      status: req.body.status
    });

    if (!complaint) {
      res.status(404).send({
        status: false,
        message: "Complaint not found",
        data: {
          message: "Complaint not found"
        }
      });
    }

    res.status(200).send({
      success: true,
      message: "Complaint successfully updated",
      data: {
        message: "Complaint successfully updated"
      }
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: "Error updating compliant",
      data: err
    });
  }
};

// delete a complaint
exports.deleteOne = async (req, res) => {
  try {
    let complaint = await Complaint.findByIdAndRemove(req.params.id);

    if (!complaint) {
      res.status(404).send({
        success: false,
        message: "Complain not found",
        error: {
          message
        }
      });
    }

    res.status(200).send({
      success: true,
      message: "Complaint deleted successfully",
      data: {
        message: "Complaint deleted successfully"
      }
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Error deleting complaint",
      error: err
    });
  }
};

// create and register new complaint
// @route       GET /complaint/new/:ownerId
// @desc        Public creates complaints to store Owner admins
// @access      Public
exports.newComplaint = async (req, res) => {

  // Validate body request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Deconstruct req body
  const { name, email, message } = req.body

  try {
    // Get Store Owner Id from the URL Parameter
    let urlStoreOwner = await StoreOwner.findById(req.params.ownerId);

    // If Id exists, create complaint
    let newComplaint = await Complaint({
      name, 
      email,
      message,
      storeOwner: req.params.ownerId
    })

    urlStoreOwner.complaints.push(newComplaint);

    const complaint = await urlStoreOwner.save();

    // let comp = null;

    res.json({
      success: true,
      message: "Complaint successfully sent to store owner!",
      data: {
        statusCode: 200,
        complaint: newComplaint
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      success: false,
      message: "Server Error. Store Owner Id doesn't exist!",
      data: {
          statusCode: 500,
          error: err.message
      }
    });
  }
};
