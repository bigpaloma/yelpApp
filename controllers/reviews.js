const Campgrounds = require("../models/campgrounds");
const Reviews = require("../models/review")

module.exports.createReview = async (req, res) => {
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
};

module.exports.newReviewPage = async (req, res) => {
    const { id } = req.params;
    const campground = await Campgrounds.findById(id);
    res.render("reviews/new", { campground });
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campgrounds.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
};