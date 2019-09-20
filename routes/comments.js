let express = require("express");
let router = express.Router({ mergeParams: true });
let Campground = require("../models/campground");
let Comment = require("../models/comment");
let middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, resp) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash("error", "Campground not found");
      return resp.redirect("back");
    }
    resp.render("comments/new", { campground: campground });
  });
});

router.post("/", middleware.isLoggedIn, (req, resp) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      req.flash("error", "Campground not found");
      resp.redirect("/campgrounds");
    }
    Comment.create(req.body.comment, (err, comment) => {
      if (err) {
        req.flash("error", "Comment not added: " + err.message);
        return resp.redirect("back");
      }
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      comment.save();
      campground.comments.push(comment);
      campground.save();
      req.flash("success", "Comment added");
      resp.redirect(`/campgrounds/${campground._id}`);
    });
  });
});

//COMMENT EDIT ROUTE
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, resp) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        return resp.redirect("back");
      }
      Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
          req.flash("error", "Comment not found");
          resp.redirect("back");
        } else {
          resp.render("comments/edit", {
            campground_id: req.params.id,
            comment: foundComment
          });
        }
      });
    }); 
  }
);

//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req, resp) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        req.flash("error", "Comment not updated: " + err.message);
        resp.redirect("back");
      } else {
        req.flash("success", "Comment updated");
        resp.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, resp) => {
  Comment.findByIdAndDelete(req.params.comment_id, err => {
    if (err) {
      req.flash("error", "Comment not removed: " + err.message);
      resp.redirect("back");
    } else {
      req.flash("success", "Comment removed");
      resp.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

module.exports = router;
