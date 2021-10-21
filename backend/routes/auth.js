const express = require("express");
const { signUp, signIn, signOut, isSignedIn } = require("../controllers/auth");
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);

router.get("/protected", isSignedIn, (req, res) => res.send(req.auth));

module.exports = router;
