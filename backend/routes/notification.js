const express = require("express");
const { message, email, alert } = require("../controllers/notification");
const router = express.Router();

router.post("/message", message);
router.post("/email", email);
router.get("/alert", alert);

module.exports = router;
