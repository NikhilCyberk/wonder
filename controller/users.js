const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  //   res.send("form");
  res.render("./users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ email, username });
    const registerUser = await User.register(newUser, password);
    //   console.log(registerUser);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Signup Success");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = async (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to the wanderlust! you are now logged in");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are now logged out");
    res.redirect("/listings");
  });
};
