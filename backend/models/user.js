//import mongoose
const mongoose = require("mongoose");
//import bcrypt
const bcrypt = require("bcrypt");

//creating user schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//hashing password
userSchema.pre("save", async function (next) {
  //It means: run this code before("PRE") "Save"

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); //First is password, second is salt round
  }

  next();
});

//export model
module.exports = mongoose.model("User", userSchema);
