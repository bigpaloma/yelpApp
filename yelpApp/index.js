const express = require("express");
const app = express(); 4

const path = require("path");

const ejsMate = require("ejs-mate");

const Joi = require("joi");

// const morgan = require("morgan");
// app.use(morgan("tiny"));

const AppError = require("./errors/appError");
const asyncErr = require("./errors/asyncErr");

var methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelpApp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const Campgrounds = require("./models/campgrounds");
const { joiSchemaCampground, joiSchemaReview } = require("./joiSchemas/campgroundData.js");

const Review = require("./models/review")

app.engine("ejs", ejsMate);
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

const verifyPassword = (req, res, next) => {
    if (req.query.pass === "chicken") {
        next();
    }
    throw new AppError("", 401);
    // throw new Error("Passphrase required!");
    // res.send("SORRY YOU NEED A PASSWORD!")
}

const validateCampgroundData = (req, res, next) => {
    const { error } = joiSchemaCampground.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    }
    next()
}

const validateReviewData = (req, res, next) => {
    const { error } = joiSchemaReview.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    }
    next()
}

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/secret", verifyPassword, (req, res) => {
    res.send("JACKEDY JACKA JACKA!!!")
})

app.get("/campgrounds", asyncErr(async (req, res) => {
    const campgrounds = await Campgrounds.find({});
    res.render("campgrounds/index", { campgrounds });
}))

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
})

app.post("/campgrounds", validateCampgroundData, asyncErr(async (req, res) => {
    // if (!req.body.campgrounds) throw new AppError("Invalid Campground Data", 400)
    // console.log(req.body)
    const createdCamp = await Campgrounds.create(req.body.campground);
    res.redirect(`/campgrounds/${createdCamp.id}`);
}))

app.post("/campgrounds/:id/reviews", validateReviewData, asyncErr(async (req, res) => {
    const { id } = req.params;
    const createdReview = await Review.create(req.body.review);
    const campground = await Campgrounds.findById(id); 0
    campground.reviews.push(createdReview);
    createdReview.save();
    campground.save();
    console.log(campground)
    res.redirect(`/campgrounds/${campground.id}`);
}))


app.get("/campgrounds/:id", asyncErr(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgrounds.findById(id).populate("reviews");
    const reviews = campground.reviews
    res.render("campgrounds/show", { campground });
}))

app.get("/campgrounds/:id/edit", asyncErr(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgrounds.findById(id);
    res.render("campgrounds/edit", { campground });
}))

app.get("/campgrounds/:id/reviews/new", asyncErr(async (req, res) => {
    const { id } = req.params;
    const campground = await Campgrounds.findById(id);
    res.render("reviews/new", { campground });
}))

app.patch("/campgrounds/:id/", validateCampgroundData, asyncErr(async (req, res) => {
    const { id } = req.params;
    await Campgrounds.findByIdAndUpdate(id, req.body.campground);
    res.redirect("/campgrounds");
}))

app.delete("/campgrounds/:id/", asyncErr(async (req, res) => {
    const { id } = req.params;
    await Campgrounds.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

app.get("/error", (req, res) => {
    chicken.fly();
})

app.all("*", (req, res, next) => {
    next(new AppError("404 PAGE NOT FOUND", 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Oh No Seomthing went Wrong";
    res.status(status).render("error", { err, status })
})

app.listen(3000, () => {
    console.log("Port 3000 open!")
})