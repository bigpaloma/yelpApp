const express = require("express");
const app = express();
const router = express.Router();
const session = require("express-session");
const flash = require("express-flash");
const Campgrounds = require("../models/campgrounds");
const User = require("../models/user");
const asyncErr = require("../errors/asyncErr");
const AppError = require("../errors/appError");
const { validateCampgroundData, isOwner, isLoggedIn } = require("../middleware");
const {newCampground} = require("../controllers/campgrounds")

app.use(
  session({
    secret: "secretphrase",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

router.get(
  "/",
  asyncErr(async (req, res) => {
    const campgrounds = await Campgrounds.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, isOwner, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampgroundData,
  isLoggedIn, 
  asyncErr()
);

router.get(
  "/:id",
  asyncErr(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgrounds.findById(id).populate({path: "reviews", populate: {path: "owner"}}).populate("owner");
    res.render("campgrounds/show", {
      campground
    });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  asyncErr(async (req, res) => {
      const { id } = req.params;
      const campground = await Campgrounds.findById(id);
      res.render("campgrounds/edit", { campground });
  })
);

router.patch(
  "/:id/",
  isLoggedIn,
  isOwner, 
  validateCampgroundData,
  asyncErr(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgrounds.findByIdAndUpdate(id, req.body.campground);
    req.flash("success", "Successfully updated your Listing.")
    res.redirect(`/campgrounds/${campground.id}`);
  })
);

router.delete(
  "/:id/",
  isLoggedIn,
  isOwner, 
  asyncErr(async (req, res) => {
    const { id } = req.params;
    await Campgrounds.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
