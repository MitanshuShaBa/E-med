const Medicine = require("../../models/Medicine");
const Stock = require("../../models/Stock");

const createStock = (req, res) => {
  const {
    medicine,
    expiry,
    price,
    cost,
    quantity,
    isAvailable,
    isMR,
    managedBy,
  } = req.body;
  const mrStock = new Stock({
    medicine,
    expiry,
    price,
    cost,
    quantity,
    isAvailable,
    isMR,
    managedBy,
  });

  mrStock.save((err, stock) => {
    if (err) {
      return res.status(400).send({ error: err });
    }
    return res.send(stock);
  });
};

exports.createStockForMR = (req, res) => {
  if (req.body.isNew) {
    const { name, description, imgCaption, imgURLs, type, company } = req.body;
    const medicine = new Medicine({
      name,
      description,
      imgCaption,
      imgURLs,
      type,
      company,
    });

    medicine.save((err, medicine) => {
      if (err) {
        return res.status(400).send({ error: err });
      }
      req.body.medicine = medicine._id;

      createStock(req, res);
      return;
    });
  } else {
    createStock(req, res);
    return;
  }
};

exports.getAllFromMR = (_req, res) => {
  Stock.find({ isMR: true })
    .populate("managedBy", "-encry_password -salt")
    .populate("medicine")
    .exec((err, items) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send(items);
    });
};

exports.getAllFromSpecificMR = (req, res) => {
  const { mrID } = req.params;
  Stock.find({ isMR: true, managedBy: mrID })
    .populate("managedBy", "-encry_password -salt")
    .populate("medicine")
    .exec((err, items) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send(items);
    });
};

exports.getItemFromMR = (req, res) => {
  const { stockID } = req.params;
  Stock.findOne({ _id: stockID, isMR: true })
    .populate("managedBy", "-encry_password -salt")
    .populate("medicine")
    .exec((err, item) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send(item);
    });
};

exports.updateItemFromMR = (req, res) => {
  const { _id } = req.body;
  Stock.findOneAndUpdate({ _id, isMR: true }, { ...req.body }).exec(
    (err, _result) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send({ msg: "Updated successfully" });
    }
  );
};

exports.deleteItemFromMR = (req, res) => {
  const { stockID } = req.params;
  Stock.findOneAndDelete({ _id: stockID, isMR: true }).exec((err, _result) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    res.send({ msg: "successfully deleted" });
  });
};
