const express = require("express");
const storeAssistantController = require('../controllers/storeAssistant');
const auth = require('../auth/auth');

const router = express.Router();

//  Create a new Store Assistant.
router.post("/store_assistant/new", auth, storeAssistantController.createStoreAssistant);


//  Get All Store Assistants.
router.get("/store_assistant", auth, storeAssistantController.getAllStoreAssistants);


//  Get a Single Store Assistant.
router.get("/store_assistant/:assistant_id", auth, storeAssistantController.getSingleStoreAssistant);


//  Update a Single Store Assistant.
router.put("/store_assistant/:assistant_id", auth, storeAssistantController.updateSingleStoreAssistant);


//  Delete a Single Store Assistant.
router.delete("/store_assistant/:assistant_id", auth, storeAssistantController.deleteSingleStoreAssistant);

module.exports = router;