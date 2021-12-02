const express = require("express");
const {
  message,
  email,
  alert,
  deleteAlert,
} = require("../controllers/notification");
const router = express.Router();

router.post("/message", message);
router.post("/email", email);
router.get("/alert", alert);
router.delete("/alert/:id", deleteAlert);

module.exports = router;
