//import nodemailer
const nodemailer = require("nodemailer");
//import User model
const User = require("../models/user");
//import EmailVerification model
const EmailVerificationToken = require("../models/emailVerificationToken");
// import isValidObjectId to check user is exists or not
const { isValidObjectId } = require("mongoose");
// import generate OTP function
const { generateOTP, generateMailTransporter } = require("../utils/mail");
//import global messages
const global = require("../utils/global");

//createUser service
exports.create = async (req, res) => {
  //getting req from front
  const { name, email, password } = req.body;

  //look for email is already exists or not
  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.json({
      statusCode: 401,
      message: EMAIL_EXIST,
      isSuccess: false,
      messageType: "INFO",
    });
  }
  //create newUser class
  const newUser = new User({ name, email, password });
  //save to database
  await newUser.save();

  //generate 6 digit otp
  let OTP = generateOTP();
  //store otp inside our db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });
  await newEmailVerificationToken.save();

  //send that otp to our user
  var transport = generateMailTransporter();

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
  res.json({
    statusCode: 201,
    message: EMAIL_VERIFY,
    isSuccess: true,
    messageType: "INFO",
    data: {
      otp: OTP,
    },
  });
};

//email verify
exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;
  if (!isValidObjectId(userId)) {
    return res.json({
      statusCode: 200,
      messageType: "INFO",
      message: INVALID_USER,
      isSuccess: false,
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.json({
      statusCode: 200,
      messageType: "INFO",
      message: USER_NOTFOUND,
      isSuccess: false,
    });
  }
  if (user.isVerified) {
    return res.json({
      statusCode: 200,
      messageType: "INFO",
      message: VERIFIED_USER,
      isSuccess: false,
    });
  }

  const token = await EmailVerificationToken.findOne({ owner: userId });

  if (!token) {
    return res.json({
      statusCode: 200,
      messageType: "INFO",
      message: TOKEN_NOTFOUND,
      isSuccess: false,
    });
  }

  const isMatched = await token.compareToken(OTP);
  if (!isMatched) {
    return res.json({
      statusCode: 200,
      messageType: "INFO",
      message: VALID_OTP,
      isSuccess: false,
    });
  }
  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);
  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Welcome E-mail",
    html: `
<h1>Welcome to our app and thanks for choosing us!</h1>
  `,
  });

  res.json({
    statusCode: 200,
    messageType: "INFO",
    message: VERIFIED_EMAIL,
    isSuccess: false,
  });
};

//resend email verification
exports.resendEmailVerification = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    return res.json({
      statusCode: 200,
      messageType: "INFO",
      message: USER_NOTFOUND,
      isSuccess: false,
    });
  }
  if (user.isVerified) {
    return res.json({
      statusCode: 200,
      messageType: "INFO",
      message: VERIFIED_USER,
      isSuccess: false,
    });
  }

  const alreadyHasToken = await EmailVerificationToken.findOne({
    owner: userId,
  });
  if (alreadyHasToken) {
    return res.json({
      statusCode: 200,
      messageType: "INFO",
      message: TRY_AFTER_AN_HOUR,
      isSuccess: false,
    });
  }
  //generate 6 digit otp
  let OTP = generateOTP();

  var transport = generateMailTransporter();

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "E-mail Verification",
    html: `
    <p>Your verification OTP</p>
    <h1>${OTP}</h1>
    `,
  });

  res.json({
    statusCode: 200,
    messageType: "INFO",
    message: OTP_SENT,
    isSuccess: false,
  });
};
