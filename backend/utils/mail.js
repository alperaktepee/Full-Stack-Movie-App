exports.generateOTP = (otp_length=6)=>{
      //generate 6 digit otp
  let OTP = "";
  for (let i = 1; i <= otp_length; i++) {
    const randomValue = Math.round(Math.random() * 9);
    OTP += randomValue;
  }
  return OTP;
}

exports.generateMailTransporter = ()=>{
    nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "b0826494f7efde",
          pass: "ea318af8a39d5f",
        },
      });
}