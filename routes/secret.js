const express = require("express");
const router = express.Router();
const session = require("express-session");
const app = express();

const AppError = require("../errors/appError");
const {isLoggedIn} = require("../middleware");

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
