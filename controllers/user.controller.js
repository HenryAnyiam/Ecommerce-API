const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
const User = require("../models/user.model");
const TwoFactorAuth = require("../models/twoFactorAuth.model");
const Cart = require("../models/cart.model");
const Profile = require("../models/profile.model");
const sendVerification = require("../utils/user.verification");


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: [
	"id",
	"username",
	"email",
	"role",
	"phone",
      ],
      include: [
	{ model: Address },
	{ model: Profile },
      ],
    });
    return res.status(200).json(user);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}


exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, phone, firstName, lastName } = req?.body;
    const user = await User.create({
      username,
      email,
      role,
      phone,
      password: password && bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });
    let photo;
    if (req.file) {
      photo = req.file.path;
    }
    await user.createProfile({ firstName, lastName, photo, });
    const secret = speakeasy.generateSecret({ length: 16 }).base32;
    await user.createTwoFactorAuth({ secret });
    await user.createCart();
    await sendVerification.emailUser({ email, secret, type: "Verify" });
    return res.status(201).json({
      username,
      email,
      emailVerify: user.emailVerify,
      role,
      phone,
      phoneVerify: user.phoneVerify,
      profile: {
	firstName,
	lastName,
	photo,
      },
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}


exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
	{ model: TwoFactorAuth },
	{ model: Profile },
      ],
    });
    await user.update({
      username: req.body.username || user.username,
      role: req.body.role || user.role,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
    });

    await user.Profile.update({
      firstName: req.body.firstName || user.Profile.firstName,
      lastName: req.body.lastName || user.Profile.lastName,
    });
    if (req.file) {
      profile.photo = req.file.path;
      await profile.save();
    }

    if (req.body.email) {
      user.emailVerify = false;
      await sendVerification.emailUser({
	email: req.body.email,
	secret: user.TwoFactorAuth.secret,
	type: "Verify"
      });
    }

    if (req.body.phone) {
      user.phoneVerify = false;
    }
    await user.save();
    return res.status(200).json({
      username: user.username,
      email: user.email,
      emailVerify: user.emailVerify,
      role: user.role,
      phone: user.phone,
      phoneVerify: user.phoneVerify,
      profile,
    });
  } catch {
    return res.status(400).json({ message: e.message });
  }
}


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    return res.status(204);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}


exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    const profile = await User.getProfile();
    res.status(200).json(profile);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}
