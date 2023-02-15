const express = require("express");

//import controllers
const { createUser } = require("../controllers/user");

//use Router
const router = express.Router();

//Routing controllers
router.post("/create", createUser);

//export Router
module.exports = router;
