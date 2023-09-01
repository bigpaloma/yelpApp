const express = require("express");
const router = express.Router();
const session = require("express-session");
const app = express();

const AppError = require("../errors/appError");

const isLoggedIn = (req, res, next) => {
  if (!req.session.user_id) {
    return res.render("users/login");
  }
  next();
};

app.use(
  session({
    secret: "secretphrase",
    resave: false,
    saveUninitialized: false,
  })
);

router.get("/", isLoggedIn, (req, res) => {
  res.send("JACKEDY JACKA JACKA!!!");
});

module.exports = router;
