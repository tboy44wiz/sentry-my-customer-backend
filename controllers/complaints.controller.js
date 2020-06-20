const Complaint = require("../models/complaint_form");

// Retieves all complaints
exports.findAll = async (req, res) => {
  try {
    await Complaint.find()
      .sort({ createdAt: -1 })
      .then(complaints => {
        res.status(200).json({
          data: complaints
        });
      });
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: "Error occured while retriving complaints"
    });
  }
};

// update complaint
exports.update = async (req, res) => {
  // validating the message
  if (!req.body.message || "") {
    return res.status(404).send({
      message: "Message field canot be empty"
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
        message: "Complaint not found"
      });
    }

    res.status(200).send({
      message: "Complaint successfully updated"
    });
  } catch (err) {
    res.status(500).send({
      message: "Error updating compliant"
    });
  }
};

// delete a complaint
exports.deleteOne = async (req, res) => {
  try {
    let complaint = await Complaint.findByIdAndRemove(req.params.id);

    if (!complaint) {
      res.status(404).send("Complain not found");
    }

    res.send({
      message: "Complaint deleted successfully"
    });
  } catch (err) {
    res.status(500).send({
      message: "Error deleting complaint"
    });
  }
};

// create and register new complaint
exports.newComplaint = async (req, res) => {
  // validate message field
  if (!req.body.message || "") {
    return res.status(404).send({
      message: "Message field canot be empty"
    });
  }

  try {
    // create new complaint
    let complaint = await new Complaint({
      message: req.body.message
    });

    let result = await complaint.save();

    res.status(200).json({
      data: result
    });
  } catch (err) {
    res.status(500).send({
      message: "Error deleting complaint"
    });
  }
};
