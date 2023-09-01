const express = require("express");
const app = express();
const router = express.Router();
const session = require("express-session");
const flash = require("express-flash");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Campgrounds = require("../models/campgrounds");
const { userSchemaCampground } = require("../joiSchemas/campgroundData.js");

const asyncErr = require("../errors/asyncErr");

const validateUserData = (req, res, next) => {
  const { error } = userSchemaCampground.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
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

app.use(flash());

router.get(
  "/register",
  asyncErr(async (req, res) => {
    res.render("users/register");
  })
);

router.post(
  "/register",
  asyncErr(async (req, res) => {
    const { username, password, firstname, name } = req.body.user;
    const createdUser = await User.create({
      username,
      firstname,
      name,
      password,
    });
    req.session.user_id = createdUser._id;
    const campgrounds = await Campgrounds.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get(
  "/login",
  asyncErr(async (req, res) => {
    res.render("users/login");
  })
);

router.post(
  "/login",
  asyncErr(async (req, res) => {
    const { username, password, firstname, name } = req.body.user;
    const user = await User.findAndValidate(username, password);
    if (user) {
      const campgrounds = await Campgrounds.find({});
      req.session.user_id = user._id;
      res.render("campgrounds/index", { campgrounds });
    } else {
      res.render("users/login");
    }
  })
);

router.post(
  "/logout",
  asyncErr(async (req, res) => {
    req.session.user_id = null;
    res.render("users/login");
  })
);

module.exports = router;
