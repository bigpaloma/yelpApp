if(process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

const path = require("path");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const passportLocal = require("passport-local");

const AppError = require("./errors/appError");

const User = require("./models/user");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const secretRoutes = require("./routes/secret");
const userRoutes = require("./routes/user");

var methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelpApp");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "secretphrase",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 604800000,
      expires: Date.now() + 604800000,
    },
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/secret", secretRoutes);
app.use("/", userRoutes);

app.all("*", (req, res, next) => {
  req.flash("error", "The Page you are looking for could not be found ");
  next(new AppError("404 PAGE NOT FOUND", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh No Seomthing went Wrong";
  res.status(status).render("error", { err, status });
});

app.listen(3000, () => {
  console.log("Port 3000 open!");
});
