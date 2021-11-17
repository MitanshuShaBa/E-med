const express = require("express");
const { message, email } = require("../controllers/notification");
const router = express.Router();

router.post("/message", message);
router.post("/email", email);

module.exports = router;
