const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  // this check that user is logged in or not
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    //redirect URL
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
//check if user is owner  or not
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // console.log(listing.owner._id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "Access denied");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//for validating new lisitng for sending to the server
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  //   console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//for validating new reviews for sending to the server
module.exports.validateReviws = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  //   console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//check if user is owner  or not for review
module.exports.isReviewAuther = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  // console.log(listing.owner._id);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "Access denied");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
