const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

//for validating new lisitng for sending to the server
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  //   console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//index routes
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

//new route
router.get("/new", (req, res) => {
  res.render("./listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "listing not found");
      res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
  })
);

//create a new listing
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data for listing");
    // }
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if (result.error) {

    // }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Listing saved!");
    res.redirect("/listings");
  })
);

//edit routes
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing not found");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

// Update
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //delistings
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  })
);
// Delete Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
