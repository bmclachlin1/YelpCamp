var express = require("express");
var router = express.Router();
var Campgrounds = require("../models/campgrounds");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campgrounds.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

//CREATE - add new campground to database, then redirect
router.post("/", middleware.isLoggedIn, function(req, res){
	//get data from form and add to newCampground object
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, description: desc, author: author};
	//add campground to database, then redirect
	Campgrounds.create(newCampground, function(err, newlyCreated){
		if(err) {
			console.log("Error: " + err);
		} else {
			req.flash("success", "Successfully added campground");
			res.redirect("/campgrounds");
		}
	});
});

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW - show info about one campground
router.get("/:id", function(req, res){
	//find the campground with provided id
	Campgrounds.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err) {
			console.log("Error: " + err);
		} else {
			//render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

//EDIT - show edit form for one campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campgrounds.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE - update a campground, then redirect
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	Campgrounds.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE - delete a campground, then redirect
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	//find and delete the correct campground
	Campgrounds.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			req.flash("success", "Campground deleted");
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;