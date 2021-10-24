const express = require("express");
const {
  createOrder,
  getOrdersFromPharmacy,
  getOrdersFromMR,
  getOrder,
  updateOrder,
  getOrdersOfUser,
} = require("../controllers/order");
const router = express.Router();

router.post("/pharmacy/create", createOrder);
router.get("/pharmacy/:pharmacyID", getOrdersFromPharmacy); // get all for this pharmacy
router.get("/pharmacy/order/:orderID", getOrder);
router.patch("/pharmacy", updateOrder);

router.post("/mr/create", createOrder);
router.get("/mr/:mrID", getOrdersFromMR); // get all for this mr
router.get("/mr/order/:orderID", getOrder);
router.patch("/mr", updateOrder);

router.get("/user/:userID", getOrdersOfUser);

module.exports = router;
