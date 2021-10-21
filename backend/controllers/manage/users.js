const User = require("../../models/User");

exports.getUserByID = (req, res) => {
  const { userID } = req.params;
  User.findById(userID, ["_id", "name", "email", "role", "userManagedBy"])
    .sort({ role: "asc" })
    .populate("userManagedBy", ["_id", "name", "email", "role"].join(" "))
    .exec((err, user) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send(user);
    });
};

exports.getUsers = (_req, res) => {
  User.find({}, ["_id", "name", "email", "role", "userManagedBy", "managedBy"])
    .sort({ role: "asc" })
    .populate(
      "userManagedBy managedBy",
      ["_id", "name", "email", "role"].join(" ")
    )
    .exec((err, users) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send(users);
    });
};

exports.getUsersFromPharmacy = (req, res) => {
  const { pharmacyID } = req.params;
  User.find({ role: "user", userManagedBy: pharmacyID }, [
    "_id",
    "name",
    "email",
    "role",
    "userManagedBy",
  ])
    .populate("userManagedBy", ["_id", "name", "email", "role"].join(" "))
    .exec((err, users) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send(users);
    });
};

exports.addPharmacyToUser = (req, res) => {
  const { userID, pharmacyID } = req.body;
  User.findOneAndUpdate(
    { _id: userID },
    { $addToSet: { userManagedBy: pharmacyID } }
  ).exec((err, _user) => {
    if (err) {
      res.status(400).send({ error: err });
    }

    res.send({ msg: "Success" });
  });
};

exports.updateUserInfo = (req, res) => {
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
