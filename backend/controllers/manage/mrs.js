const User = require("../../models/User");

exports.getMRByID = (req, res) => {
  const { userID } = req.params;
  User.findById(userID, ["_id", "name", "email", "role"])
    .sort({ role: "asc" })
    .exec((err, user) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send(user);
    });
};

exports.getMRs = (_req, res) => {
  User.find({ role: "mr" }, ["_id", "name", "email", "role"]).exec(
    (err, users) => {
      if (err) {
        res.status(400).send({ error: err });
      }

      res.send(users);
    }
  );
};
