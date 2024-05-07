const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");
const TwoFactorAuth = require("../models/twoFactorAuth.model");
const accountSid = process.env.TWILIO_ACCT_SID;
const authToken = process.env.TWILIO_TOKEN
const client = require("twilio")(accountSid, authToken);


exports.emailUser = async (params) => {
  try {
    const { type, email, secret, link } = params;
    let text, subject, totp;
    if (type == "Reset" || type == "TwoFactor") {
      totp = speakeasy.totp({
	secret,
	encoding: "base32",
	time: 600,
      });
      text = `TOTP: ${totp}. Token expires in 10 minutes`;
    } else {
      totp = speakeasy.totp({
        secret,
        encoding: "base32",
        time: 3600,
      });
    }
      subject = "Verify Your Email";
      if (type == "Verify") {
	text = `Verify your email\n
	TOTP: ${totp}.\nToken expires in 1 hour`;
      } else if ( type == "TwoFactor" ) {
	subject = "Two factor Authentiaction"
      } else if (type == "Reset") {
	subject = "Reset your password"; 
      } else {
	text = `To avoid account deletion,
	  please verify your user email\n
	  TOTP: ${totp}.\nToken expires in 1hr`;
      }
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    });
    return { message: "Email verification sent. Redirect to verify-email" };
  } catch (e) {
    throw new Error(e.message);
  }
}


exports.smsUser = (params) => {
  const { phone, secret } = params;

  const totp = speakeasy.totp({ secret, encoding: "base32", time: 3600 });
  client.messages
    .create({
      body: `Your verification code is ${totp}`,
      to: phone,
      from: process.env.TWILIO_NUMBER,
    })
    .then((message) => console.log(message.sid))
    .catch((err) => {console.log(err.message)});
}
