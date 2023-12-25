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
const reviewController = require("../controller/review.js");


// / Reviews
// POST Route
router.post(
  "/",
  isLoggedIn,
  validateReviws,
  wrapAsync(reviewController.createReview)
);

//delete reviews route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuther,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
