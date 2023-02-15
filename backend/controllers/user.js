//import User model
const User = require("../models/user");

//createUser service
exports.create = async (req, res) => {
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

  // var transport = nodemailer.createTransport({
  //   host: "sandbox.smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "b0826494f7efde",
  //     pass: "ea318af8a39d5f"
  //   }
  // });

  //send back to user
  res.status(201).json({ user: newUser });
};
