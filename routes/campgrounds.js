const express = require("express");
const app = express();
const router = express.Router();
const session = require("express-session");
const flash = require("express-flash");

const Campgrounds = require("../models/campgrounds");
const { joiSchemaCampground } = require("../joiSchemas/campgroundData.js");

const asyncErr = require("../errors/asyncErr");

const validateCampgroundData = (req, res, next) => {
    const { error } = joiSchemaCampground.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    }
    next()
}

app.use(session({
    secret: 'secretphrase',
    resave: false,
    saveUninitialized: false,
}));

app.use(flash());

router.get("/", asyncErr(async (req, res) => {
    const campgrounds = await Campgrounds.find({});
    res.render("campgrounds/index", { campgrounds });
}))

router.get("/new", (req, res) => {
    res.render("campgrounds/new");
})

router.post("/", validateCampgroundData, asyncErr(async (req, res) => {
    // if (!req.body.campgrounds) throw new routerError("Invalid Campground Data", 400)
    // console.log(req.body)
    const createdCamp = await Campgrounds.create(req.body.campground);
    res.redirect(`/campgrounds/${createdCamp.id}`);
}))

router.get("/:id", asyncErr(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgrounds.findById(id).populate("reviews");
    const reviews = campground.reviews
    res.render("campgrounds/show", { campground, messages: req.flash('success')});
}))

router.get("/:id/edit", asyncErr(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgrounds.findById(id);
    res.render("campgrounds/edit", { campground });
}))

router.patch("/:id/", validateCampgroundData, asyncErr(async (req, res) => {
    const { id } = req.params;
    await Campgrounds.findByIdAndUpdate(id, req.body.campground);
    res.redirect("/campgrounds");
}))

router.delete("/:id/", asyncErr(async (req, res) => {
    const { id } = req.params;
    await Campgrounds.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

module.exports = router;