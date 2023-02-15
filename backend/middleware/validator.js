//import express validator
const { check, validationResult } = require("express-validator");

//user validator
exports.userValidator = [
  check("name").trim().not().isEmpty().withMessage("Name cannot be empty!"),
  check("email").normalizeEmail().isEmail().withMessage("Invalid e-mail!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Invalid password !").isLength({min:8,max:20}).withMessage("Password must be 8 to 20 characters long! "),
];


//export validation
exports.validate=(req,res,next)=>{
   const error= validationResult(req).array()
    console.log(error);
    if(error.length){
        return res.json({error:error[0].msg})
    }
    next();
}