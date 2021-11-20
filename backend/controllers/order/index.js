const mongoose = require("mongoose");
const luxon = require("luxon");
const Alert = require("../../models/Alert");
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
  const order = await Order.findById(_id).populate(
    "buyer seller items.medicineID items.productID"
  );

  // console.log(order);
  // console.log(order.items);

  if (req.body.status === "completed" && order.buyer.role === "pharmacist") {
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        const order = await Order.findById(_id)
          .populate("items.productID")
          .session(session);
        order.status = "completed";

        for (const item of order?.items) {
          const stock = await Stock.findById(item.productID).session(session);

          stock.quantity = stock.quantity - item.quantity;

          if (stock.quantity < 0) {
            throw new Error(`Insufficient quantity of Stock`);
          }

          await stock.save();

          const newStock = await Stock.create(
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

          const alert = new Alert({
            sender: item.productID.managedBy,
            receiver: order.buyer._id,
          });
          alert.triggerQuantity = Math.floor(item.quantity * 0.1);
          alert.stock = newStock[0]._id;
          alert.message = `It's time to refill your medicines for ${item.name}`;
          alert.save();
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

    order.items.map((item) => {
      const alert = new Alert({
        sender: item.productID.managedBy,
        receiver: order.buyer._id,
      });
      const expiryDate = luxon.DateTime.fromJSDate(
        new Date(item.productID.expiry)
      );
      const duration = luxon.DateTime.now().plus(
        luxon.Duration.fromObject({ days: item.productID.duration })
      );
      alert.triggerDate = expiryDate < duration ? expiryDate : duration;
      alert.message = `It's time to refill your medicines for ${item.name}`;
      alert.save();
    });

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
