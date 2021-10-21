const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { isSignedIn } = require("./middlewares");

exports.isSignedIn = isSignedIn;

exports.signUp = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      if (err.keyPattern?.email === 1) {
        return res.status(406).json({
          error: "User with this email already exists",
        });
      }
      return res.status(400).json({
        error: err.message,
      });
    }

    respondWithTokenAndUser(res, user);
  });
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User email does not exist",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Password do not match",
      });
    }

    respondWithTokenAndUser(res, user);
  });
};

exports.signOut = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signed out",
  });
};

const respondWithTokenAndUser = (res, user) => {
  const { _id, email, role } = user;
  const token = jwt.sign({ id: _id, email, scope: role }, process.env.SECRET);

  //Put token in cookie
  res.cookie("token", token, { expire: new Date(Date.now() + 1) });

  //send response to front end
  res.json({
    token,
    user,
  });
};
