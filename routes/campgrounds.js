var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
       if(err){
           req.flash("error","Campgrounds not found!");
           res.redirect("back");
       } else {
          res.render("campgrounds/index", {campgrounds: campgrounds}); 
       }
    });
});

// CREATE Campground
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add it to campgrounds array
    var newName = req.body.name;
    var newPrice = req.body.price;
    var newImage = req.body.image;
    var newDesc = req.body.description;
    var newAuthor = {
            id: req.user._id,
            username: req.user.username
    };
    var newCampground = {name: newName, price: newPrice, image: newImage, description: newDesc, author: newAuthor};
    Campground.create(newCampground,function(err, newlyCreated){
        if(err){
            req.flash("error","Someting went wrong!");
            res.redirect("back");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

// NEW Campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("error","Campground not found!");
            res.redirect("back");
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           req.flash("error","Campground not found!");
           res.redirect("back");
       }else{
            res.render("campgrounds/edit", {campground: foundCampground});
       }
    });
});

// UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
       if(err){
           req.flash("error","Campground not found!");
           res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds/"+req.params.id);
       }
   });
});

// DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          req.flash("error","Campground not found!");
          res.redirect("/campgrounds");
      }else{
          req.flash("success","Campground deleted!");
          res.redirect("/campgrounds");
      } 
   });
});

module.exports = router;
