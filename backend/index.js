const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

const authRoutes = require("./routes/auth");
const manageRoutes = require("./routes/manage");
const stockRoutes = require("./routes/stock");
const orderRoutes = require("./routes/order");

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/manage", manageRoutes);
app.use("/stock", stockRoutes);
app.use("/order", orderRoutes);

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
