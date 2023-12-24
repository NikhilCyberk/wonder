const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
  //   res.send("form");
  res.render("./users/signup.ejs");
});

module.exports = router;
