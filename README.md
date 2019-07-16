****************************************************************************************************************
Project Name: YelpCamp
Purpose: web application to share campgrounds!
Author: Blake McLachlin
Last Date Revised: 07/12/2019
Course: Web developer bootcamp
****************************************************************************************************************

RESTful Routes table for campgrounds

Route Name	Url						HTTP VERB		Description
****************************************************************************************************************
INDEX		/campgrounds			GET				Display all campgrounds

NEW			/campgrounds/new		GET				Show form to make new campgrounds

CREATE 		/campgrounds			POST			Add new campground to database, then redirect

SHOW		/campgrounds/:id		GET				Show info about one campground

EDIT		/campgrounds/:id/edit	GET				Show edit form of one campgrounds

UPDATE 		/campgrounds/:id		PUT				Update a particular campground, then redirect

DESTROY		/campgrounds/:id		DELETE			Delete a particular campground, then redirect
****************************************************************************************************************

RESTful Routes table for comments (comments dependant on campground - associations)

Route Name	Url								HTTP VERB		Description
****************************************************************************************************************
NEW			/campgrounds/:id/comments/new	GET				Show form to add comment to campground

CREATE		/campgrounds/:id/comments		POST			Add new comment to campground, then 	redirect
****************************************************************************************************************
