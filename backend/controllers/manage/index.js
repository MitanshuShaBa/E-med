const userController = require("./users");
const adminController = require("./admins");
const mrController = require("./mrs");
const pharmascistController = require("./pharmascists");
const staffController = require("./staff");

module.exports = {
  ...userController,
  ...adminController,
  ...mrController,
  ...pharmascistController,
  ...staffController,
};
