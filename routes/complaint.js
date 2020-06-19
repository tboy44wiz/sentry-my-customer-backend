const express = require("express");
const router = express.Router();
const complaintsController = require("../controllers/complaints.controller");

// Get all complaints
router.get("/all", complaintsController.findAll);

// Update a complaint
router.get("/update/:id", complaintsController.update);

// Create a new complaint
router.post("/new", complaintsController.newComplaint);

// Delete a complaint
router.delete("/delete/:id", complaintsController.deleteOne);

module.exports = router;
