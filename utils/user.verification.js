const authenticator = require("google_authenticator");
const nodemailer = require("nodemailer");
const User = require("../models/user.model");
const TwoFactorAuth = require("../models/twoFactorAuth.model");

exports.sendTotpToEmail = async (email, secret) => {
  try {
    const totp = authenticator.generateToken(secret);
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.evn.EMAIL_PASSWORD,
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
