const express = require("express");
const app = express();
const router = express.Router({mergeParams: true});
const session = require("express-session");
const flash = require("express-flash");

const Campgrounds = require("../models/campgrounds");
const Reviews = require("../models/review")
const {validateReviewData, isLoggedIn, isOwner, isReviewOwner} = require("../middleware");
const asyncErr = require("../errors/asyncErr");

app.use(session({
    secret: 'secretphrase',
    resave: false,
    saveUninitialized: false,
}));

app.use(flash());

app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

router.post("/", isLoggedIn, validateReviewData, asyncErr(async (req, res) => {
    const { id } = req.params;
    const review = new Reviews(req.body.review);
    review.owner = req.user.id;
    const campground = await Campgrounds.findById(id);
    campground.reviews.push(review);
    review.save();
    campground.save();
    req.flash('success', 'Review created');
    res.redirect(`/campgrounds/${campground.id}`);
    //  res.redirect(`/reviews/campgrounds/${campground.id}/reviews/new`);
}))

router.get("/new", isLoggedIn, asyncErr(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgrounds.findById(id);
    res.render("reviews/new", { campground });
}))

router.delete("/:reviewId", isLoggedIn, isReviewOwner, asyncErr(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campgrounds.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;