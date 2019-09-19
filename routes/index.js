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
      req.flash("error", err.message);
      return resp.redirect("register");
    }
    passport.authenticate("local")(req, resp, function() {
      req.flash("success", "Welcome to Yelp Camp!");
      resp.redirect("/campgrounds");
    });
  });
});

router.get("/login", (req, resp) => {
  resp.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  })
);

router.get("/logout", (req, resp) => {
  req.logout();
  req.flash("success", "You have logged out!");
  resp.redirect("/campgrounds");
});

module.exports = router;
