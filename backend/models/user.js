//import mongoose
const mongoose = require("mongoose");

//creating user schema
const userSchema = mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
});

//export model
module.exports = mongoose.model("User",userSchema)