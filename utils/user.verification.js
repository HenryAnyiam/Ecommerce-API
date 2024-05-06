const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");
const TwoFactorAuth = require("../models/twoFactorAuth.model");

exports.emailUser = async (params) => {
  try {
    const { type, email, secret, link } = params;
    let text, subject;
    if (type != "Reset") {
      const totp = speakeasy.totp({ secret, encoding: "base32" });
      subject = "Verify Your Email";
      if (type == "Verify") {
	text = `Verify your email\n
	TOTP: ${totp}`;
      } else if ( type == "TwoFactor" ) {
	subject = "Two factor Authentiaction"
	text = `TOTP: ${totp}`;
      } else {
	text = `To avoid account deletion,
	  please verify your user email\n
	TOTP: ${totp}`;
      }
    } else {
      subject = "Reset your password";
      text = `Follow the link to reset your password\n
      ${link}`;
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
      subject: "Verify Your Email",
      text: `${totp}`
    });
    return { message: "Email verification sent. Redirect to verify-email" };
  } catch (e) {
    throw new Error(e.message);
  }
}
