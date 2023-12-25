module.exports.isLoggedIn = (req, res, next) => {
  // this check that user is logged in or not
  // console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};
