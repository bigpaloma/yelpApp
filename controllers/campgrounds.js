module.exports.newCampground = async (req, res) => {
    // if (!req.body.campgrounds) throw new routerError("Invalid Campground Data", 400)
    // console.log(req.body)
    try {
      const createdCamp = new Campgrounds(req.body.campground);
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
  }