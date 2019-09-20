let express = require("express");
let router = express.Router();
let Campground = require("../models/campground");
let middleware = require("../middleware");

router.get("/", (req, resp) => {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      req.flash("error", "Cannot load campgrounds: " + err.message);
    }
    resp.render("campgrounds/index", {
      campgrounds: allCampgrounds
    });
  });
});

router.post("/", middleware.isLoggedIn, (req, resp) => {
  let name = req.body.campgroundName;
  let image = req.body.campgroundImage;
  let description = req.body.campgroundDescription;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let campground = {
    name: name,
    image: image,
    description: description,
    author: author
  };
  Campground.create(campground, (err, campground) => {
    if (err) {
      req.flash("error", "Creating unsuccessful: " + err.message);
    }
    resp.redirect("/campgrounds");
  });
});

router.get("/new", middleware.isLoggedIn, (req, resp) => {
  resp.render("campgrounds/new");
});

router.get("/:id", (req, resp) => {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        return resp.redirect("back");
      }
      resp.render("campgrounds/show", { campground: foundCampground });
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, resp) => {
  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      req.flash("error", "Campground not found");
      return resp.redirect("back");
    }
    resp.render("campgrounds/edit", { campground: foundCampground });
  });
});

router.put("/:id", middleware.checkCampgroundOwnership, (req, resp) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, foundAndUpdatedCampground) => {
      if (err) {
        req.flash("error", "Campground not found");
        return resp.redirect("/campgrounds");
      }
      req.flash("success", "Campground has been successfully updated");
      resp.redirect(`/campgrounds/${req.params.id}`);
    }
  );
});

router.delete("/:id", middleware.checkCampgroundOwnership, (req, resp) => {
  Campground.findByIdAndDelete(req.params.id, err => {
    if (err) {
      req.flash("error", "Campground not found");
      return resp.redirect("back");
    }
    req.flash("success", "Your post has been removed");
    resp.redirect("/campgrounds");
  });
});

module.exports = router;
