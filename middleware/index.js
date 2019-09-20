let Campground = require("../models/campground");
let Comment = require("../models/comment");

let middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function(req, resp, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, (err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "Campground not found");
        resp.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You are not the owner of this post");
          resp.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You are not logged in!");
    resp.redirect("/login");
  }
};

middlewareObject.checkCommentOwnership = function(req, resp, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err || !foundComment) {
        req.flash("error", "Comment not found");
        resp.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You are not the owner of this comment");
          resp.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You are not logged in!");
    resp.redirect("/login");
  }
};

middlewareObject.isLoggedIn = function(req, resp, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in!");
  resp.redirect("/login");
};

module.exports = middlewareObject;
