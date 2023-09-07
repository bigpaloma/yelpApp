const express = require("express");
const app = express();
const router = express.Router();
const session = require("express-session");
const flash = require("express-flash");
const asyncErr = require("../errors/asyncErr");
const { validateCampgroundData, isOwner, isLoggedIn } = require("../middleware");
const campgrounds = require("../controllers/campgrounds")

app.use(
  session({
    secret: "secretphrase",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

router.route("/")
  .get(asyncErr(campgrounds.index))
  .post(validateCampgroundData, isLoggedIn, asyncErr(campgrounds.newCampground));

router.get("/new", isLoggedIn, campgrounds.newPage);

router.route("/:id")
  .get(asyncErr(campgrounds.showPage))
  .patch(isLoggedIn, isOwner, validateCampgroundData, asyncErr(campgrounds.updateCampground))
  .delete(isLoggedIn, isOwner, asyncErr(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isOwner, asyncErr(campgrounds.editPage));

module.exports = router;
