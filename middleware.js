const { joiSchemaCampground } = require("./joiSchemas/campgroundData.js");
const Campgrounds = require("./models/campgrounds");
const Reviews = require("./models/review");
const { joiSchemaReview } = require("./joiSchemas/campgroundData.js");
const { userSchemaCampground } = require("./joiSchemas/campgroundData.js");


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
      req.session.returnTo = req.originalUrl;
      req.flash("error", "Not Logged In")
      return res.redirect("/login");
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
}

module.exports.validateUserData = (req, res, next) => {
  const { error } = userSchemaCampground.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  }
  next();
};

module.exports.validateCampgroundData = (req, res, next) => {
  const { error } = joiSchemaCampground.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campgrounds.findById(id).populate("owner");
  if(!campground.owner.id.equals(req.user._id)) {
    req.flash("error", "You do not have persmission to do that!")
    return res.redirect(`/campgrounds/${campground.id}`);
  }
  next();
};

module.exports.isReviewOwner = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Reviews.findById(reviewId);
  if(!review.owner.equals(req.user._id)) {
    req.flash("error", "You do not have persmission to do that!")
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReviewData = (req, res, next) => {
  const { error } = joiSchemaReview.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new AppError(msg, 400)
  }
  next()
}