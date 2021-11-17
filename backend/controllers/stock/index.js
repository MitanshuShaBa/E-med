const mrController = require("./mr");
const pharmacyController = require("./pharmacy");
const medicineController = require("./medicine");

module.exports = {
  ...pharmacyController,
  ...mrController,
  ...medicineController,
};
