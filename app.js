//Initialization

require('dotenv').config();

var express 				= require("express"),
	app 					= express(),
	bodyParser 				= require("body-parser"),
	mongoose 				= require("mongoose"),
	passport 				= require("passport"),
	LocalStrategy 			= require("passport-local"),
	PassportLocalMongoose 	= require("passport-local-mongoose"),
	User 					= require("./models/user"),
	seedDB 					= require("./seeds"),
	methodOverride 			= require("method-override"),
	flash 					= require("connect-flash");

//Requiring Routes
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes 	 = require("./routes/comments"),
	authRoutes 		 = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";

mongoose.connect(url, {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB!");
}).catch(err => {
	console.log("ERROR: " + err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "Lexi is the cutest dog",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MIDDLEWARE
//passes req.user to every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", authRoutes);

//For running the server on port 3000 or heroku
var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("The YelpCamp server has started!");
});