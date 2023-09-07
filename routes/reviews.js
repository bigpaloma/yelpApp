const express = require("express");
const app = express();
const router = express.Router({mergeParams: true});
const session = require("express-session");
const flash = require("express-flash");
const {validateReviewData, isLoggedIn, isReviewOwner} = require("../middleware");
const asyncErr = require("../errors/asyncErr");
const {createReview, newReviewPage, deleteReview} = require("../controllers/reviews")

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

router.post("/", isLoggedIn, validateReviewData, asyncErr(createReview))

router.get("/new", isLoggedIn, asyncErr(newReviewPage))

router.delete("/:reviewId", isLoggedIn, isReviewOwner, asyncErr(deleteReview))

module.exports = router;