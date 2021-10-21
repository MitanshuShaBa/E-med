const Stock = require("../../models/Stock");

exports.createStockForPharmacy = (req, res) => {
  const pharmacyStock = new Stock(req.body);
  pharmacyStock.save((err, stock) => {
    if (err) {
      return res.status(400).send({
        error: err,
        debug: req.body.managedBy,
      });
    }
    res.send(stock);
  });
};

exports.getAllFromPharmacy = (_req, res) => {
  Stock.find({ isMR: false, isAvailable: true }, [
    "_id",
    "name",
    "description",
    "type",
    "company",
    "price",
    "quantity",
    "managedBy",
  ])
    .populate("managedBy", ["_id", "name"].join(" "))
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
  Stock.find({ isMR: false, managedBy: pharmacyID }, [
    "_id",
    "name",
    "description",
    "type",
    "company",
    "price",
    "cost",
    "quantity",
    "isAvailable",
    "managedBy",
  ])
    .populate("managedBy", ["_id", "name"].join(" "))
    .exec((err, items) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send(items);
    });
};

exports.getItemFromPharmacy = (req, res) => {
  const { stockID } = req.params;
  Stock.findOne({ _id: stockID }, [
    "_id",
    "name",
    "description",
    "type",
    "company",
    "price",
    "cost",
    "quantity",
    "isAvailable",
    "managedBy",
  ])
    .populate("managedBy", ["_id", "name"].join(" "))
    .exec((err, items) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send(items);
    });
};

exports.updateItemFromPharmacy = (req, res) => {
  const { _id } = req.body;
  Stock.findOneAndUpdate({ _id }, { ...req.body }).exec((err, result) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    res.send({ msg: "Updated successfully" });
  });
};

exports.deleteItemFromPharmacy = (req, res) => {
  const { stockID } = req.params;
  Stock.findOneAndDelete({ _id: stockID }).exec((err, _result) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    // TODO delete from the firebase storage
    res.send({ msg: "successfully deleted" });
  });
};
