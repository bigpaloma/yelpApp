const express = require("express");
const app = express();
const router = express.Router();
const session = require("express-session");
const flash = require("express-flash");
const bcrypt = require("bcrypt");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("../models/user");
const asyncErr = require("../errors/asyncErr");
const { storeReturnTo } = require('../middleware');

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


// Register with bcrypt Auth
// router.post(
//   "/register",
//   asyncErr(async (req, res) => {
//     const { username, password, firstname, name } = req.body.user;
//     const createdUser = await User.create({
//       username,
//       firstname,
//       name,
//       password,
//     });
//     req.session.user_id = createdUser._id;
//     const campgrounds = await Campgrounds.find({});
//     res.render("campgrounds/index", { campgrounds });
//   })
// );

// Register with passport Auth
router.post(
  "/register",
  asyncErr(async (req, res) => {
    try{
      const { email, username, password} = req.body.user;
      const newUser = new User ({
      username,
      email
      });
      const createdUser = await User.register(newUser, password);
      req.login(createdUser, function(err) {
        if (err) { return next(err); }
        req.flash("success", "Registered successfully");
        return res.redirect("/campgrounds"); 
      });
    } catch(e){
      req.flash("error", e.message);
      res.redirect("/register")
    }
  })
);

router.get(
  "/login",
  asyncErr(async (req, res) => {
    res.render("users/login");
  })
);


//LOGIN WITH BCRYPT AUTH
// router.post(
//   "/login",
//   asyncErr(async (req, res) => {
//     const { username, password, firstname, name } = req.body.user;
//     const user = await User.findAndValidate(username, password);
//     if (user) {
//       req.session.user_id = user._id;
//       res.redirect("/campgrounds");
//     } else {
//       res.render("users/login");
//     }
//   })
// );


//LOGIN WITH PASSPORT AUTH
router.post(
  "/login",
  storeReturnTo,
  passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}),
  asyncErr(async (req, res) => {
    req.flash("success", "Welcome Back!")
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
  })
);

// LOGOUT FROM SCRATCH
// router.post(
//   "/logout",
//   asyncErr(async (req, res) => {
//     req.session.user_id = null;
//     res.render("users/login");
//   })
// );

// LOGOUT WITH PASSPORT
router.post(
  "/logout",
  (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash("success", "Logout Successfull");
      return res.redirect("/campgrounds"); 
  });
});

router.get(
  "/user/:id",
  asyncErr(async (req, res) => {
    const foundUser = await User.findById(req.params.id).populate("campgrounds");
    res.render("users/show", {foundUser});
  })
);

module.exports = router;
