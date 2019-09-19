let express = require("express");
let router = express.Router({ mergeParams: true });
let Campground = require("../models/campground");
let Comment = require("../models/comment");
let middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, resp) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    }
    resp.render("comments/new", { campground: campground });
  });
});

router.post("/", middleware.isLoggedIn, (req, resp) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
      resp.redirect("/campgrounds");
    }
    Comment.create(req.body.comment, (err, comment) => {
      if (err) {
        req.flash("error", "Something went wrong");
        console.log(err);
      }
      comment.author.id = req.user._id;
      comment.author.username = req.user.username;
      comment.save();
      campground.comments.push(comment);
      campground.save();
      req.flash("success", "Comment was successfully added");
      resp.redirect(`/campgrounds/${campground._id}`);
    });
  });
});

//COMMENT EDIT ROUTE
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, resp) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        resp.redirect("back");
      } else {
        resp.render("comments/edit", {
          campground_id: req.params.id,
          comment: foundComment
        });
      }
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
        resp.redirect("back");
      } else {
        resp.redirect(`/campgrounds/${req.params.id}`);
      }
    }
  );
});

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, resp) => {
  Comment.findByIdAndDelete(req.params.comment_id, err => {
    if (err) {
      resp.redirect("back");
    } else {
      req.flash("success", "Your comment has been removed");
      resp.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

module.exports = router;
