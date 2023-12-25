const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//index routes
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  })
);

//new route
router.get("/new", isLoggedIn, (req, res) => {
  // console.log("req.user");
  res.render("./listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "listing not found");
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", { listing });
  })
);

//create a new listing
router.post(
  "/",
  isLoggedIn,
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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing saved!");
    res.redirect("/listings");
  })
);

//edit routes
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
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
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;

    // let listing = await Listing.findById(id);
    // // console.log(listing.owner._id);
    // if (!listing.owner._id.equals(res.locals.currUser._id)) {
    //   req.flash("error", "you don't have permission to edit");
    //   return res.redirect(`/listings/${id}`);
    // }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //delistings
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  })
);
// Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
