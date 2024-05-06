const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const TwoFactorAuth = require("../models/twoFactorAuth.model");
const authSecret = process.env.AUTH_SECRET
const bcrypt = require("bcryptjs");
const authenticator = require("google_authenticator");
const nodemailer = require("nodemailer");

exports.authenticateUser = async (req, res) => {
  try {
    const { email, username, password } = req?.body;
    let user;
    if (email) {
      user = await User.findOne({ where: { email } });
    } else if (username) {
      user = await User.findOne({ where: { email } });
    }

    if (!user) {
      return res.status(404)
    }

    if (!user.emailVerify) {
      return res.status(400).json({ message: "Email not verified. Verify to login" });
    }

    if (!user.phoneVerify) {
      return res.status(400).json({ message: "Phone not verified. Verify to login" });
    }

    if (bcrypt.compareSync(user.password, password)) {
      const twoFactorAuth = await user.getTwoFactorAuth();
      if (twoFactorAuth.enabled == false) {
	const token = jwt.sign({ userId: user.id }, authSecret, { expiresIn: 23200 });
	return res.status(200).json({ token: token });
      } else {
	const totp = authenticator.generateToken(twoFactorAuth.secret);
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
	  to: user.email,
	  subject: "Two Factor Auth Token",
	  text: `${totp}`
	});
	return res.status(200).json({ message: "Two factor otp sent. Redirect to verify-otp" });
      }
    }

    return res.status(400).json({ message: "Incorrect Password!" });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

exports.verifyTotp = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
      include: [{ model: TwoFactorAuth }],
    });
    if (authenticator.verifyToken(user.TwoFactorAuth.secret, req.body.totp)) {
      const token = jwt.sign({ userId: user.id }, authSecret, { expiresIn: 23200 });
      return res.status(200).json({ token: token });
    } else {
      res.status(403).json({ message: "Incorrect totp!" });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}


exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
      include: [{ model: TwoFactorAuth }],
    });
    if (authenticator.verifyToken(user.TwoFactorAuth.secret, req.body.totp)) {
      await user.update({ emailVerify: true });
      return res.status(200).json({ message: "Email Verified" });
    } else {
      res.status(403).json({ message: "Incorrect totp!" });
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

exports.logoutUser = async (req, res) => {
  try {
    req.session = null;
    return res.status(204);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req?.body;
    const user = await User.findByPk(req.user);
    if (bcrypt.compareSync(user.password, oldPassword)) {
      await user.update({ password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)) });
      return res.status(200).json({ message: "Password Successfully Updated" });
    }

    return res.status(400).json({ message: "Old password incorrect!" });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}
