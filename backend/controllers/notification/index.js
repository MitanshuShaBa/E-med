const luxon = require("luxon");
const Alert = require("../../models/Alert");
const { transporter } = require("../../utils/transporter");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

exports.message = (req, res) => {
  client.messages
    .create({
      body: req.body.message,
      from: "+12484138416",
      // to: req.body.phoneNumber, // This won't work because it is trial account, if the account is activated fully then this will work
      // to: "+919920892410",
      to: "+919726995070",
    })
    .then((message) => res.json({ message }))
    .catch((err) => res.status(400).json({ error: err }));
};

exports.email = (req, res) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    // to: "noreply.e.med@gmail.com",
    subject: "E-med Store",
    html: `<h3>${req.body.message}</h3>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.json(err);
    }
    res.status(200).send({ email: req.body.email, msg: "Email sent", info });
  });
};

exports.alert = (req, res) => {
  Alert.find()
    .populate("stock receiver sender")
    .exec((err, alerts) => {
      if (err) {
        return res.json(err);
      }

      alerts.map((alert) => {
        if (alert.receiver.role === "user") {
          const triggerDate = luxon.DateTime.fromJSDate(
            new Date(alert.triggerDate)
          );
          const today = luxon.DateTime.now();
          if (triggerDate <= today) {
            sendAlert(alert);
          }
        } else {
          const triggerQuantity = alert.triggerQuantity;
          const currentQuantity = alert.stock.quantity;
          if (currentQuantity <= triggerQuantity) {
            sendAlert(alert);
          }
        }
      });

      res.json({ msg: "Alerts sent" });
    });
};

exports.deleteAlert = (req, res) => {
  Alert.findOneAndDelete({ order: req.params.id })
    .exec()
    .then((err, _alert) => {
      if (err || !_alert) {
        return res.status(400).json({ error: err });
      }

      res.json({ msg: "Alert deleted" });
    });
};

const sendAlert = (alert) => {
  console.log(alert._id);
  const mailOptions = {
    from: process.env.EMAIL,
    to: alert.receiver.email,
    // to: "noreply.e.med@gmail.com",
    subject: "Medicine Refill Notification",
    html: `<h3>${alert.message}</h3>
                  <p>Sent on behalf of ${alert.sender.email}</p>
          `,
  };
  transporter.sendMail(mailOptions, (err, info) => {});

  client.messages.create({
    body: `${alert.message}\nSent on behalf of ${alert.sender.email}`,
    from: "+12484138416",
    // to: alert.receiver.phoneNumber, // This won't work because it is trial account, if the account is activated fully then this will work
    // to: "+919920892410",
    to: "+919726995070",
  });

  Alert.findByIdAndDelete(alert._id).exec();
};
