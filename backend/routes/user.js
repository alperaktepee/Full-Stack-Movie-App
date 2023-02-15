const express = require("express");
//import controllers
const { create } = require("../controllers/user");
//import userValidator
const { userValidator,validate } = require("../middleware/validator");

//use Router
const router = express.Router();

//Routing controllers
router.post("/create",userValidator,validate, create);

//export Router
module.exports = router;
