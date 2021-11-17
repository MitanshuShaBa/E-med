const express = require("express");
const {
  getReports,
  getReportsMR,
  getReportsPharmacy,
} = require("../controllers/report");
const router = express.Router();

router.get("/", getReports);
router.get("/mr/:mrID", getReportsMR);
router.get("/pharmacist/:pharmacyID", getReportsPharmacy);

module.exports = router;
