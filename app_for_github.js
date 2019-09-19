const express = require("express"),
  app = express(),
  parser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDB = require("./seeds");

let commentRoutes = require("./routes/comments"),
  campgroundRoutes = require("./routes/campgrounds"),
  indexRoutes = require("./routes/index");

mongoUri =
  "mongodb+srv://test:test@mycluster-qmvgr.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
app.use(parser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.use(
  require("express-session")({
    secret: "This is a secret",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, resp, next) => {
  resp.locals.currentUser = req.user;
  resp.locals.error = req.flash("error");
  resp.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, () => {
  console.log("Listening!");
});
