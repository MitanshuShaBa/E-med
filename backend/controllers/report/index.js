const Order = require("../../models/Order");
const { DateTime, Interval } = require("luxon");

const report = (orders) => {
  let total_revenue = 0;
  let total_sales = 0;
  let total_orders = 0;
  let total_orders_cancelled = 0;
  let sale_per_item = {};

  orders.forEach((order) => {
    if (order.status == "cancelled") {
      total_orders_cancelled += 1;
    } else {
      total_orders += 1;
      total_revenue += order.total;

      order.items.map((item) => {
        total_sales += item.quantity;
        if (sale_per_item[item.medicineID._id] !== undefined) {
          // item is in sales_per_item
          sale_per_item[item.medicineID._id].quantity =
            sale_per_item[item.medicineID._id].quantity + item.quantity;

          sale_per_item[item.medicineID._id].total =
            sale_per_item[item.medicineID._id].total +
            item.quantity * item.price;
        } else {
          // item is not in sales_per_item so add it
          sale_per_item[item.medicineID._id] = {
            quantity: item.quantity,
            total: item.quantity * item.price,
            name: item.medicineID.name,
          };
        }
      });
    }
  });

  let most_sold_item = Object.keys(sale_per_item);
  most_sold_item.sort(
    (a, b) => sale_per_item[b].quantity - sale_per_item[a].quantity
  );
  most_sold_item = most_sold_item.slice(0, 5); // apply logic to select top
  most_sold_item = most_sold_item.map((item) => sale_per_item[item]);

  let most_revenue_item = Object.keys(sale_per_item);
  most_revenue_item.sort(
    (a, b) => sale_per_item[b].total - sale_per_item[a].total
  );
  most_revenue_item = most_revenue_item.slice(0, 5); // apply logic to select top
  most_revenue_item = most_revenue_item.map((item) => sale_per_item[item]);

  return {
    total_revenue,
    total_sales,
    total_orders,
    total_orders_cancelled,
    sale_per_item,
    most_sold_item,
    most_revenue_item,
  };
};

const isToday = (someDate, today) => {
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

const orderAccordingToTimePeriod = (err, orders, res) => {
  if (err) {
    return res.status(400).json({ error: err });
  }

  let weekOrders = [];
  let monthOrders = [];
  let dayOrders = [];

  let dateNow = DateTime.local();
  let datePrevWeek = dateNow.minus({ days: 7 });
  let datePrevMonth = dateNow.minus({ days: 30 });
  let weekInterval = Interval.fromDateTimes(datePrevWeek, dateNow);
  let monthInterval = Interval.fromDateTimes(datePrevMonth, dateNow);

  orders.forEach((order) => {
    let orderDate = DateTime.fromJSDate(new Date(order.createdAt));
    if (weekInterval.contains(orderDate)) {
      weekOrders.push(order);
    }
    if (monthInterval.contains(orderDate)) {
      monthOrders.push(order);
    }
    if (isToday(orderDate.toJSDate(), dateNow.toJSDate())) {
      dayOrders.push(order);
    }
  });
  return res.json({
    total: report(orders),
    day: report(dayOrders),
    week: report(weekOrders),
    month: report(monthOrders),
  });
};

module.exports.getReports = (req, res) => {
  Order.find()
    .populate("items.medicineID")
    .exec((err, orders) => {
      orderAccordingToTimePeriod(err, orders, res);
    });
};

module.exports.getReportsMR = (req, res) => {
  const { mrID } = req.params;
  Order.find({ seller: mrID })
    .populate("items.medicineID")
    .exec((err, orders) => {
      orderAccordingToTimePeriod(err, orders, res);
    });
};

module.exports.getReportsPharmacy = (req, res) => {
  const { pharmacyID } = req.params;
  Order.find({ seller: pharmacyID })
    .populate("items.medicineID")
    .exec((err, orders) => {
      orderAccordingToTimePeriod(err, orders, res);
    });
};
