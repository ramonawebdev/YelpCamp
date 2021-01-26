var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// Root route
router.get("/", function(req, res){
  res.render("landing"); 
});

// Register
router.get("/register", function(req, res) {
   res.render("register"); 
});

// Handling sign up
router.post("/register", function(req, res) {
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           req.flash("error",err.message);
           return res.redirect("/register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success","Welcome to YelpCamp "+req.body.username);
           res.redirect("/campgrounds");
       });
   });
});

// Login
router.get("/login", function(req, res) {
    res.render("login");
});

// Handling login
router.post("/login",passport.authenticate("local", {
   successRedirect: "/campgrounds",
   failureRedirect: "/login"
}), function(req, res) {
});

// Logout
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success","Logged out!");
   res.redirect("/campgrounds");
});

module.exports = router;