var express = require("express");
var router = express.Router({mergeParams: true});
var Campgrounds = require("../models/campgrounds");
var Comments = require("../models/comments");
var middleware = require("../middleware");

//CREATE - Add new comment to database, then redirect
router.post("/", middleware.isLoggedIn, function(req, res){
	//lookup campground using id
	Campgrounds.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log("Error: " + err);
			res.redirect("/campgrounds");
		} else {
			//create new comment
			Comments.create(req.body.comment, function(err, comment){
				if(err) {
					console.log("Error: " + err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//connect new comment to associated campground
					foundCampground.comments.push(comment);
					foundCampground.save();
					//redirect to campground show page
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
});

//NEW - show form to add comment to campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	//find campground by id
	Campgrounds.findById(req.params.id, function(err, foundCampground){
		if(err) {
			console.log("Error: " + err);
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

//EDIT - show edit form for one comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comments.findById(req.params.comment_id, function(err, foundComment){
		if(err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//UPDATE - update a comment, then redirect
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	//find and update the correct comment
	Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DELETE - delete a comment, then redirect
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	//find and delete correct comment
	Comments.findByIdAndRemove(req.params.comment_id, function(err, deletedComment){
		if(err) {
			console.log(err);
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;