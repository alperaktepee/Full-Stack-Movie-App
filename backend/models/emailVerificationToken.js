//import mongoose
const mongoose = require("mongoose")
//import bcrypt
const bcrypt = require("bcrypt");

//email verification Schema
const emailVerificationTokenSchema=mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    token:{
        type:String,
        required:true
    },
    createAt:{
        type:Date,
        expires:3600,
        default:Date.now()
    }
})


//hashing email
emailVerificationTokenSchema.pre("save", async function (next) {
    //It means: run this code before("PRE") "Save"
  
    if (this.isModified("token")) {
      this.token = await bcrypt.hash(this.token, 10); //First is token, second is salt round
    }
  
    next();
  });


  //export model
module.exports = mongoose.model("EmailVerificationTokenSchema", emailVerificationTokenSchema);