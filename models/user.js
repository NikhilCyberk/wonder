const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: "String",
    required: true,
  }, //pasport will automatically add username and password
});

// this add username and password AND provide hashing and salting
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
