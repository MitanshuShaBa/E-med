const User = require("../../models/User");

exports.getAdminByID = (req, res) => {
  const { userID } = req.params;
  User.findById(userID, ["_id", "name", "email", "role"])
    .sort({ role: "asc" })
    .exec((err, users) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send(users);
    });
};

exports.getAdmins = (_req, res) => {
  User.find({ role: "admin" }, ["_id", "name", "email", "role"]).exec(
    (err, users) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send(users);
    }
  );
};
