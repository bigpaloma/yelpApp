const express = require("express");
const app = express();
const router = express.Router();
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const asyncErr = require("../errors/asyncErr");
const { storeReturnTo } = require('../middleware');
const users = require("../controllers/users")

app.use(
  session({
    secret: "secretphrase",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

router.route("/register")
  .get(users.showRegister)
  .post(asyncErr(users.registerUser));

router.route("/login")
  .get(users.showLogin)
  .post(storeReturnTo,
    passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), users.login);

router.post("/logout", users.logout);

router.get("/user/:id", asyncErr(users.showPage));

module.exports = router;
