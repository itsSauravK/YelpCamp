var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj={};
// all middlr
middlewareObj.checkOwnership = function(req,res,next){

    
        if(req.isAuthenticated()){
            //does usr owns it
            
            Campground.findById(req.params.id,function(err, foundCamp){
               
                    if(err || !foundCamp){
                        req.flash("error","Campground not found");
                       
                        res.redirect("back");
                    }
                    
                    else{
                        //console.log(foundCamp.name);
                        if(foundCamp.author.id.equals(req.user._id)){
                            next();
                        }else{
                            req.flash("error","You are not authenticated!");
                            res.redirect("back"); //go to backpage
                        }
                        
                }
            });
        }else{
            req.flash("error","You need to be logged in to do that!");
            res.redirect("back");
        }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		//does usr owns it
		
		Comment.findById(req.params.comment_id,function(err, foundComment){
             
				if(err || !foundComment){
					req.flash("error","Comment not found");
					res.redirect("back");
				}
				
				else{
					//console.log(foundCamp.name);
					if(foundComment.author.id.equals(req.user._id)){
						next();
					}else{
                        req.flash("error","You dont have permission to do that");
						res.redirect("back"); //go to backpage
					}
					
			}
		});
	}else{
        req.flash("error","You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn= function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
        req.flash("error", "You need to be logged in to do that!");
		res.redirect("/login");
	}
}

module.exports = middlewareObj;