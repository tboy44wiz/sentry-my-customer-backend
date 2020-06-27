const express = require("express");
const router = express.Router();
const storeController = require("./../controllers/stores");
const jwt = require('jsonwebtoken')

const auth = require('../auth/auth');
router.post("/store/new", storeController.createStore);
router.get("/store/all", storeController.getAllStores);
router.get("/store/:store_id", storeController.getStore);
router.patch("/store/update/:store_id", storeController.updateStore);
router.delete("/store/delete/:store_id", storeController.deleteStore);

module.exports = router;
