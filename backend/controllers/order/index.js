const mongoose = require("mongoose");
const Order = require("../../models/Order");
const Stock = require("../../models/Stock");

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
    .sort("-createdAt")
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
    .sort("-createdAt")
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
    .sort("-createdAt")
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

exports.updateOrder = async (req, res) => {
  const { _id } = req.body;
  // Order.findOneAndUpdate({ _id }, { ...req.body }).exec((err, order) => {
  //   if (err) {
  //     return res.status(400).send({ error: err });
  //   }

  //   res.send({ msg: "Updated successfully" });
  // });
  const order = await Order.findById(_id).populate("buyer");

  if (req.body.status === "completed" && order.buyer.role === "pharmacist") {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const order = await Order.findById(_id).session(session);
        order.status = "completed";

        for (const item of order?.items) {
          const stock = await Stock.findById(item.productID).session(session);

          stock.quantity = stock.quantity - item.quantity;

          if (stock.quantity < 0) {
            throw new Error(`Insufficient quantity of Stock`);
          }

          await stock.save();

          await Stock.create(
            [
              {
                medicine: stock.medicine,
                expiry: stock.expiry,
                cost: item.price,
                price: item.price,
                quantity: item.quantity,
                isAvailable: false,
                isMR: false,
                managedBy: order.buyer,
              },
            ],
            { session: session }
          );
        }
        await order.save();
      });
    } catch (e) {
      console.log(e);
    }
    session.endSession();
    return res.send("Transaction complete");
  } else if (req.body.status === "completed" && order.buyer.role === "user") {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const order = await Order.findById(_id).session(session);
        order.status = "completed";

        for (const item of order?.items) {
          const stock = await Stock.findById(item.productID).session(session);

          stock.quantity = stock.quantity - item.quantity;

          if (stock.quantity < 0) {
            throw new Error(`Insufficient quantity of Stock`);
          }

          if (stock.quantity === 0) {
            stock.isAvailable = false;
          }

          await stock.save();
        }
        await order.save();
      });
    } catch (e) {
      console.log(e);
    }
    session.endSession();
    return res.send("Transaction complete");
  } else {
    Order.findOneAndUpdate({ _id }, { ...req.body }).exec((err, order) => {
      if (err) {
        return res.status(400).send({ error: err });
      }

      return res.send({ msg: "Updated successfully" });
    });
  }
};
