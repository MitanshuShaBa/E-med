const Stock = require("../../models/Stock");

exports.createStockForMR = (req, res) => {
  const mrStock = new Stock(req.body);
  mrStock.save((err, stock) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    res.send(stock);
  });
};

exports.getAllFromMR = (_req, res) => {
  Stock.find({ isMR: true }, [
    "_id",
    "name",
    "description",
    "type",
    "company",
    "price",
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

exports.getAllFromSpecificMR = (req, res) => {
  const { mrID } = req.params;
  Stock.find({ isMR: true, managedBy: mrID }, [
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

exports.getItemFromMR = (req, res) => {
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

exports.updateItemFromMR = (req, res) => {
  const { _id } = req.body;
  Stock.findOneAndUpdate({ _id }, { ...req.body }).exec((err, result) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    res.send(result);
  });
};

exports.deleteItemFromMR = (req, res) => {
  const { stockID } = req.params;
  Stock.findOneAndDelete({ _id: stockID }).exec((err, _result) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    // TODO delete from the firebase storage
    res.send({ msg: "successfully deleted", debug: _result });
  });
};
