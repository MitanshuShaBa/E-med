const mrController = require("./mr");
const pharmacyController = require("./pharmacy");

module.exports = {
  ...pharmacyController,
  ...mrController,
};
