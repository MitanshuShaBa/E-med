const express = require("express");
const {
  getAllFromPharmacy,
  getAllFromSpecificPharmacy,
  createStockForPharmacy,
  getItemFromPharmacy,
  updateItemFromPharmacy,
  deleteItemFromPharmacy,
  createStockForMR,
  getAllFromMR,
  getAllFromSpecificMR,
  getItemFromMR,
  updateItemFromMR,
  deleteItemFromMR,
} = require("../controllers/stock");
const router = express.Router();

// MR Stock
router.post("/mr/add", createStockForMR);
router.get("/mr/all", getAllFromMR);
router.get("/mr/:mrID", getAllFromSpecificMR);
router.get("/mr/item/:stockID", getItemFromMR);
router.patch("/mr/item/:stockID", updateItemFromMR);
router.delete("/mr/item/:stockID", deleteItemFromMR);

// Pharmacist Stock
router.post("/pharmacy/add", createStockForPharmacy);
router.get("/pharmacy/all", getAllFromPharmacy);
router.get("/pharmacy/:pharmacyID", getAllFromSpecificPharmacy);
router.get("/pharmacy/item/:stockID", getItemFromPharmacy);
router.patch("/pharmacy/item", updateItemFromPharmacy);
router.delete("/pharmacy/item/:stockID", deleteItemFromPharmacy);

module.exports = router;
