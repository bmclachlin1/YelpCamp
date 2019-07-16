//File contains all the necessary middleware for the YelpCamp Web Application
var middlewareObj = {};
var Campgrounds = require("../models/campgrounds.js");
var Comments = require("../models/comments.js");

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	//is the user logged in?
	if(req.isAuthenticated()){
		Campgrounds.findById(req.params.id, function(err, foundCampground){
			if(err) {
				console.log(err);
				res.redirect("back");
			} else {
				//does the user own the campground? if so, go to the next thing
				if(foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	//is the user logged in?
	if(req.isAuthenticated()){
		Comments.findById(req.params.comment_id, function(err, foundComment){
			if(err) {
				console.log(err);
				res.redirect("back");
			} else {
				//does the user own the comment? if so, go to the next thing
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You don't have permission to do that!");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
};

module.exports = middlewareObj;