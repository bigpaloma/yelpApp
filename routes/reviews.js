const express = require("express");
const app = express();
const router = express.Router({mergeParams: true});
const session = require("express-session");
const flash = require("express-flash");

const Campgrounds = require("../models/campgrounds");
const Reviews = require("../models/review")
const { joiSchemaReview } = require("../joiSchemas/campgroundData.js");

const asyncErr = require("../errors/asyncErr");

const validateReviewData = (req, res, next) => {
    const { error } = joiSchemaReview.validate(req.body);
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

router.post("", validateReviewData, asyncErr(async (req, res) => {
    const { id } = req.params;
    const createdReview = await Reviews.create(req.body.review);
    const campground = await Campgrounds.findById(id); 0
    campground.reviews.push(createdReview);
    createdReview.save();
    campground.save();
    req.flash('success', 'Review created');
    res.redirect(`/campgrounds/${campground.id}`);
    //  res.redirect(`/reviews/campgrounds/${campground.id}/reviews/new`);
}))

router.get("/new", asyncErr(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgrounds.findById(id);
    res.render("reviews/new", { campground, messages: req.flash('success') });
}))

router.delete("/:reviewId", asyncErr(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campgrounds.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;