var express=require("express"),
 	app         = express(),
    bodyparser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
	flash			=require("connect-flash"),
	methodOverride=require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User         = require("./models/user"),
    seedDB      = require("./seeds")

//seedDB();
var campgroundroutes=require("./routes/campgrounds.js"),
	commentroutes=require("./routes/comments.js"),
	indexroutes=require("./routes/index.js");
	

mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false });
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret:"Rusty wins",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
	
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	//console.log(res.locals);
	res.locals.currentuser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});
//console.log(campgroundroutes);

app.use("/", indexroutes);
app.use("/campgrounds", campgroundroutes);
app.use("/campgrounds/:id/comments", commentroutes);



app.listen(process.env.PORT || 6000, process.env.IP,function(){console.log("Yelp Camp has started");});