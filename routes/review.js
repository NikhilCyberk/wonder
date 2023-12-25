const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {
  validateReviws,
  isLoggedIn,
  isReviewAuther,
} = require("../middleware.js");

// / Reviews
// POST Route
router.post(
  "/",
  isLoggedIn,
  validateReviws,
  wrapAsync(async (req, res) => {
    // console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    // console.log(newReview);
    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success", "Review saved");
    res.redirect(`/listings/${listing._id}`);
  })
);

//delete reviews route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuther,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
