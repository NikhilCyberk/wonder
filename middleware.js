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
