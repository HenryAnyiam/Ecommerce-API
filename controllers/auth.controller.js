const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const TwoFactorAuth = require("../models/twoFactorAuth.model");
const authSecret = process.env.AUTH_SECRET
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const sendVerification = require("../utils/user.verification");


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
	const token = jwt.sign({ userId: user.id }, authSecret, { expiresIn: 43200 });
	return res.status(200).json({ token: token });
      } else {
	await sendVerification.emailUser({
	  email: user.email,
	  secret: twoFactorAuth.secret,
	  type: "TwoFactor"
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
    if (speakeasy.totp.verify({
      secret: user.TwoFactorAuth.secret,
      encoding: "base32",
      token: req.body.totp
    })) {
      const token = jwt.sign({ userId: user.id }, authSecret, { expiresIn: 43200 });
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
    if (speakeasy.totp.verify({
      secret: user.TwoFactorAuth.secret,
      encoding: "base32",
      token: req.body.totp
    })) {
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
    let change, user, id;
    if (oldPassword) {
      user = await User.findByPk(req.user);
      change = bcrypt.compareSync(user.password, oldPassword);
    } else {
      jwt.verify(req.params.token, authSecret, (err, userId) => {
	if (err) {
	  return res.status(401).json({ message: `Unauthorzied! ${err.message}` });
	}
	id = userId;
      });
      user = await User.findByPk(id);
      change = true;
    }
    if (change) {
      await user.update({ password: bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10)) });
      return res.status(200).json({ message: "Password Successfully Updated" });
    }

    return res.status(400).json({ message: "Old password incorrect!" });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}


exports.resetPassword = async (req, res) => {
  try {
    const user = User.findOne({ where: { email: req.body.email }});

    if (!user) {
      res.status(404).json({ message: "No user found with given email" });
    }
    const token = jwt.sign({ userId: user.id }, authSecret, { expiresIn: 1800 });
    await sendVerification.emailUser({
      email: user.email,
      link: `${req.protocol}://${req.hostname}/api/auth/change-password/${token}`,
      type: "Reset"
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}
