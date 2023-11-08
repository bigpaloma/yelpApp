
const User = require("../models/user");
const Campgrounds = require("../models/campgrounds");
const {cloudinary} = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await Campgrounds.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.newPage = (req, res) => {
  res.render("campgrounds/new")
};

module.exports.newCampground = async (req, res) => {
    // if (!req.body.campgrounds) throw new routerError("Invalid Campground Data", 400)
    // console.log(req.body)
    try {
      // const campgroundImages = req.files
      const createdCamp = new Campgrounds(req.body.campground);
      createdCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename}))
      createdCamp.owner = req.user._id;
      await createdCamp.save();
      const foundUser = await User.findById(req.user._id);
      foundUser.campgrounds.push(createdCamp);
      foundUser.save();
      req.flash("success", "Successfully posted your Listing.")
      res.redirect(`/campgrounds/${createdCamp.id}`);
    } catch(e){
      req.flash("error", e.message);
      res.redirect("/new")
    }
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campgrounds.findByIdAndUpdate(id, req.body.campground);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}))
    campground.images.push(...imgs);
    await campground.save()
    req.flash("success", "Successfully updated your Listing.")
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campgrounds.findByIdAndDelete(id);
    res.redirect("/campgrounds");
};

module.exports.showPage = async (req, res) => {
  const { id } = req.params;
  const campground = await Campgrounds.findById(id).populate({path: "reviews", populate: {path: "owner"}}).populate("owner");
  res.render("campgrounds/show", {campground});
}

module.exports.editPage = async (req, res) => {
  const { id } = req.params;
  const campground = await Campgrounds.findById(id);
  res.render("campgrounds/edit", { campground });
}

module.exports.deleteImage = async(req, res) => {
  let { id, filename } = req.params;
  filename = `YelpCamp/${filename}`
  console.log(id, filename)
  await Campgrounds.findByIdAndUpdate(id, { $pull: { images: {filename: filename}}});
  await cloudinary.uploader.destroy(filename)
  console.log("FOOOOOOOOOUUUUUND")
  res.redirect(`/campgrounds/${id}/edit`);
}