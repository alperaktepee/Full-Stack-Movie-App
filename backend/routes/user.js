const express = require("express");
//import controllers
const { create, verifyEmail, resendEmailVerification } = require("../controllers/user");
//import userValidator
const { userValidator,validate } = require("../middleware/validator");

//use Router
const router = express.Router();

//Routing controllers
router.post("/create",userValidator,validate, create);
router.post("/verify-email",verifyEmail);
router.post("/resend-verify-email-token",resendEmailVerification);


//export Router
module.exports = router;
