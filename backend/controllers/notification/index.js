const crypto = require("crypto");
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
      to: "+919920892410",
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
