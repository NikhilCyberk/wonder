const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controller/users.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  //for signup
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(wrapAsync(userController.renderLoginForm))
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "login",
      failureFlash: "true",
    }),
    userController.login
  );

//logout
router.get("/logout", userController.logout);

module.exports = router;
