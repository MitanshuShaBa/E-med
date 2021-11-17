const Medicine = require("../../models/Medicine");

exports.getAllMedicine = (_req, res) => {
  Medicine.find().exec((err, items) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    res.send(items);
  });
};
