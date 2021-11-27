const express = require("express");
const {
  getUsers,
  getAdmins,
  getMRs,
  getPharmacists,
  getStaff,
  getUsersFromPharmacy,
  addPharmacyToUser,
  updateUserInfo,
  getUserByID,
  getAdminByID,
  getMRByID,
  getPharmascistByID,
  updatePharmascistInfo,
  addMRToPharmacy,
  getStaffByID,
  updateStaffInfo,
  deleteStaff,
  getAllPharmacists,
  getAllStaff,
} = require("../controllers/manage");
const router = express.Router();

// User
router.get("/user/:userID", getUserByID);
router.get("/users", getUsers);
router.get("/users/:pharmacyID", getUsersFromPharmacy);
router.patch("/user/info", updateUserInfo);
router.post("/user/addPharmacy", addPharmacyToUser);

// Admin
router.get("/admin/:adminID", getAdminByID);
router.get("/admins", getAdmins);
router.post("/admin/create"); // TODO
router.patch("/admin/info", updateUserInfo);

// MR
router.get("/mr/:mrID", getMRByID);
router.get("/mrs", getMRs);
router.post("/mr/create"); //TODO
router.patch("/mr/info", updateUserInfo);

// Pharmascist
router.get("/pharmacist/:pharmacistID", getPharmascistByID);
router.get("/pharmacists/:mrID", getPharmacists);
router.get("/pharmacists", getAllPharmacists);
router.post("/pharmacist/create"); //TODO
router.patch("/pharmacist/info", updatePharmascistInfo);
router.post("/pharmacist/addMR", addMRToPharmacy);

// Staff
router.get("/staff/:staffID", getStaffByID);
router.get("/staffs/:pharmacyID", getStaff);
router.get("/staffs", getAllStaff);
router.post("staff/create"); //TODO
router.patch("/staff/info", updateStaffInfo);
router.delete("/staff/remove/:userID", deleteStaff);

module.exports = router;
