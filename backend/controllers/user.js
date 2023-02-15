//import User model
const User = require("../models/user");

//createUser service
exports.createUser = async (req, res) => {
  //getting req from front
  const { name, email, password } = req.body;

  //look for email is already exists or not
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(401).json({ error: "This e-mail is already exists !" });
  }
  //create newUser class
  const newUser = new User({ name, email, password });
  //save to database
  await newUser.save();

  //send back to user
  res.status(201).json({ user: newUser });
};
