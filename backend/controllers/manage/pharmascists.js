const User = require("../../models/User");

exports.getPharmascistByID = (req, res) => {
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

exports.getAllPharmacists = (_req, res) => {
  User.find({ role: "pharmacist" }, [
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

exports.getPharmacists = (req, res) => {
  const { mrID } = req.params;
  User.find({ role: "pharmacist", managedBy: mrID }, [
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

exports.updatePharmascistInfo = (req, res) => {
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

exports.addMRToPharmacy = (req, res) => {
  const { userID, mrID } = req.body;
  User.findOneAndUpdate({ _id: userID }, { managedBy: mrID }).exec(
    (err, _user) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send({ msg: "Success" });
    }
  );
};
