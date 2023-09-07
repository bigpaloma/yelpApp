const User = require("../models/user");

module.exports.showRegister = (req, res) => {
    res.render("users/register")
};
module.exports.showLogin = (req, res) => {
    res.render("users/login")
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome Back!")
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
};

module.exports.registerUser = async (req, res) => {
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
};

module.exports.logout = (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash("success", "Logout Successfull");
      return res.redirect("/campgrounds"); 
  });
};

module.exports.showPage = async (req, res) => {
    const foundUser = await User.findById(req.params.id).populate("campgrounds");
    res.render("users/show", {foundUser});
};

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

// LOGOUT FROM SCRATCH
// router.post(
//   "/logout",
//   asyncErr(async (req, res) => {
//     req.session.user_id = null;
//     res.render("users/login");
//   })
// );