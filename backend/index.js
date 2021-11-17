const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const authRoutes = require("./routes/auth");
const manageRoutes = require("./routes/manage");
const stockRoutes = require("./routes/stock");
const orderRoutes = require("./routes/order");
const notificationRoutes = require("./routes/notification");
const reportRoutes = require("./routes/report");
const paymentRoutes = require("./routes/payment");

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/manage", manageRoutes);
app.use("/stock", stockRoutes);
app.use("/order", orderRoutes);
app.use("/notification", notificationRoutes);
app.use("/report", reportRoutes);
app.use("/payment", paymentRoutes);

// Custom Middlewares - Error handling
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(err.status).send({ error: err.message });
    return;
  }
  next();
});

//DB connections
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB CONNECTED!!");
});

// PORT
const port = process.env.PORT || 5000;

//Start server
app.listen(port, () => {
  console.log(`app is running on port ${port}...`);
});
