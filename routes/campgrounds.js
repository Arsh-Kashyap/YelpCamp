var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware=require("../middleware");

router.get("/",function(req,res){
	Campground.find({},function(err,allcampgrounds){
		if(err)
			console.log(err);
		else
			{
				res.render("campgrounds/index",{campgrounds:allcampgrounds, currentuser:req.user})
			}
	});
	
});
router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var price=req.body.price;
	//console.log(req.body);
	var desc=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newcampground={name:name, image:image, price:price, description:desc, author:author};
	Campground.create(newcampground,function(err,newlycreated){
		if(err){
			console.log(err);
		}
		else
			{
				res.redirect("/");
			}
	});
	
});
router.get("/new",middleware.isLoggedIn,function(req,res){
	
	res.render("campgrounds/new");
});
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
			if(err)
				console.log(err);
		else
			{
				res.render("campgrounds/show",{campground:foundcampground});
			}
	});
	
});

router.get("/:id/edit",middleware.checkcampgroundownership,function(req,res){
		Campground.findById(req.params.id,function(err,foundcampground){
		if(err)
			{
				res.redirect("/campgrounds");
			}
		else{
			res.render("campgrounds/edit",{campground:foundcampground});}
			
			
		});
	
	
});
router.put("/:id",middleware.checkcampgroundownership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcampground){
		if(err){
			res.redirect("/campgrounds");
		}
		else
			{
				
				res.redirect("/campgrounds/"+req.params.id);
			}
	});
});
router.delete("/:id",middleware.checkcampgroundownership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
				res.redirect("/campgrounds");			
	});
});

module.exports=router;