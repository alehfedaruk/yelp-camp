let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");

router.get("/", (req, resp) => {
  resp.render("landing");
});

router.get("/register", (req, resp) => {
  resp.render("register");
});

router.post("/register", (req, resp) => {
  let newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", "Registration failed: " + err.message);
      return resp.redirect("back");
    }
    passport.authenticate("local")(req, resp, function() {
      resp.redirect("/campgrounds");
    });
  });
});

router.get("/login", (req, resp) => {
  resp.render("login");
});

router.post("/login", (req, resp, next) => {
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    successFlash: `Welcome to Yelp Camp ${req.body.username}!`,
    failureFlash: true
  })(req, resp);
});

router.get("/logout", (req, resp) => {
  req.logout();
  req.flash("success", "You have logged out!");
  resp.redirect("/campgrounds");
});

module.exports = router;
