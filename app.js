var express =require('express');
var mongoose =require('mongoose');
var passport=require('passport');
var LocalStrategy=require('passport-local');
var flash = require("connect-flash");
var bodyParser=require('body-parser');
var methodOverride = require("method-override");
var app=express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
var User= require("./models/user");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

var seedDb=require("./seeds");

app.use(methodOverride("_method"));
app.use(flash());
//seedDb();
//PASSPORT CONFIG

//ROUTES
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");


app.use(require("express-session")({
	secret: "Yelp",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


 app.use(express.static(__dirname+"/public")); 

 app.use(function(req,res,next){ //passes current usr to every template
	 res.locals.currentUser=req.User;
	 res.locals.error = req.flash("error");
	 res.locals.success = req.flash("success");
	 next();
 });	
	//USING ROUTES
app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000,function(){
	console.log("connected");
});