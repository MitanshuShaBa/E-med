const Order = require("../../models/Order");

exports.createOrder = (req, res) => {
  const pharmacyOrder = new Order(req.body);
  pharmacyOrder.save((err, order) => {
    if (err) {
      return res.status(400).send({
        error: err,
      });
    }
    res.status(201).send(order);
  });
};

exports.getOrdersFromPharmacy = (req, res) => {
  const { pharmacyID } = req.params;
  Order.find({ seller: pharmacyID })
    .populate("buyer seller")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send(orders);
    });
};

exports.getOrdersFromMR = (req, res) => {
  const { mrID } = req.params;
  Order.find({ seller: mrID })
    .populate("buyer seller")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send(orders);
    });
};

exports.getOrdersOfUser = (req, res) => {
  const { userID } = req.params;
  Order.find({ buyer: userID })
    .populate("buyer seller")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send(orders);
    });
};

exports.getOrder = (req, res) => {
  const { orderID } = req.params;
  Order.findById(orderID)
    .populate("buyer seller")
    .exec((err, order) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      res.send(order);
    });
};

exports.updateOrder = (req, res) => {
  const { _id } = req.body;
  Order.findOneAndUpdate({ _id }, { ...req.body }).exec((err, result) => {
    if (err) {
      return res.status(400).send({ error: err });
    }

    res.send({ msg: "Updated successfully" });
  });
};
