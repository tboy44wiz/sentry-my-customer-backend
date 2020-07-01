const express = require("express");
const router = express.Router();
const storeController = require("./../controllers/stores.controller");
const bodyValidator = require('../util/body_validator')

const auth = require('../auth/auth');
router.use("/store", auth)

router.post("/store/new/:current_user", storeController.validate('body'), bodyValidator, storeController.createStore);
router.get("/store/:current_user", storeController.getAllStores);
//router.get("/store/:store_id", storeController.getStore);
//router.patch("/store/update/:store_id", storeController.updateStore);
//router.delete("/store/delete/:store_id", storeController.deleteStore);

module.exports = router;
