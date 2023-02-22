//import nodemailer
const nodemailer = require("nodemailer");
//import User model
const User = require("../models/user");
//import EmailVerification model
const EmailVerificationToken = require("../models/emailVerificationToken");
// import isValidObjectId to check user is exists or not
const { isValidObjectId } = require("mongoose");
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

  //generate 6 digit otp
  let OTP = "";
  for (let i = 0; i <= 5; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP += randomValue;
  }
  //store otp inside our db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  //send that otp to our user

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b0826494f7efde",
      pass: "ea318af8a39d5f",
    },
  });

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: newUser.email,
    subject: "E-mail Verification",
    html: `
    <p>Your verification OTP</p>
    <h1>${OTP}</h1>
    `,
  });

  //send back to user
  res.status(201).json({
    message:
      "Please verify your e-mail. OTP has been sent to your e-mail account!",
  });
};

//email verify
exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;
  if (!isValidObjectId(userId)) {
    return res.json({ error: "Invalid user!" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.json({ error: "User not found!" });
  }
  if (user.isVerified) {
    return res.json({ error: "User is already verified" });
  }

  const token = await EmailVerificationToken.findOne({ owner: userId });

  if (!token) {
    return res.json({ error: "Token not found!" });
  }

  const isMatched = await token.compareToken(OTP);
  if (!isMatched) {
    return res.json({ error: "Please submit a valid OTP!" });
  }
  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);
  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "b0826494f7efde",
      pass: "ea318af8a39d5f",
    },
  });

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Welcome E-mail",
    html: `
<h1>Welcome to our app and thanks for choosing us!</h1>
  `,
  });

  res.json({ message: "Your e-mail is verified" });
};
