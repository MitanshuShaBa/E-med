const User = require("../../models/User");

exports.getStaffByID = (req, res) => {
  const { userID } = req.params;
  User.findById(userID, ["_id", "name", "email", "role", "managedBy"])
    .sort({ role: "asc" })
    .populate("managedBy", ["_id", "name", "email", "role"].join(" "))
    .exec((err, user) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send(user);
    });
};

exports.getStaff = (req, res) => {
  const { pharmacyID } = req.params;
  User.find({ role: "staff", managedBy: pharmacyID }, [
    "_id",
    "name",
    "email",
    "role",
    "managedBy",
  ])
    .populate("managedBy", ["_id", "name", "email", "role"].join(" "))
    .exec((err, users) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send(users);
    });
};

exports.getAllStaff = (_req, res) => {
  User.find({ role: "staff" }, ["_id", "name", "email", "role", "managedBy"])
    .populate("managedBy", ["_id", "name", "email", "role"].join(" "))
    .exec((err, users) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send(users);
    });
};

exports.updateStaffInfo = (req, res) => {
  const { userID, name, email, phoneNum } = req.body;
  User.findByIdAndUpdate(userID, { name, email, phoneNum }).exec(
    (err, _user) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send({ msg: "Success" });
    }
  );
};

exports.deleteStaff = (req, res) => {
  const { userID } = req.body;
  User.findOneAndDelete(userID).exec((err, _user) => {
    if (err) {
      res.status(400).send({ error: err });
    }

    res.send({ msg: "Success" });
  });
};
