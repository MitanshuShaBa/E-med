const Stock = require("../../models/Stock");

exports.addStockForPharmacy = (req, res) => {
  const pharmacyStock = new Stock(req.body);
  pharmacyStock.save((err, stock) => {
    if (err) {
      return res.status(400).send({
        error: err,
      });
    }
    res.send(stock);
  });
};

exports.getAllFromPharmacy = (_req, res) => {
  Stock.find({ isMR: false, isAvailable: true })
    .populate("managedBy", "-encry_password -salt")
    .populate("medicine")
    .exec((err, items) => {
      if (err) {
        return res.status(400).send({
          error: err,
        });
      }

      res.send(items);
    });
};

exports.getAllFromSpecificPharmacy = (req, res) => {
  const { pharmacyID } = req.params;
  Stock.find({ isMR: false, managedBy: pharmacyID })
    .populate("managedBy", "-encry_password -salt")
    .populate("medicine")
    .exec((err, items) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send(items);
    });
};

exports.getItemFromPharmacy = (req, res) => {
  const { stockID } = req.params;
  Stock.findOne({ _id: stockID })
    .populate("managedBy", "-encry_password -salt")
    .populate("medicine")
    .exec((err, items) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send(items);
    });
};

exports.updateItemFromPharmacy = (req, res) => {
  const { _id } = req.body;
  Stock.findOneAndUpdate({ _id, isMR: false }, { ...req.body }).exec(
    (err, _result) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send({ msg: "Updated successfully" });
    }
  );
};

exports.deleteItemFromPharmacy = (req, res) => {
  const { stockID } = req.params;
  Stock.findOneAndDelete({ _id: stockID, isMR: false }).exec((err, _result) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    res.send({ msg: "successfully deleted" });
  });
};
