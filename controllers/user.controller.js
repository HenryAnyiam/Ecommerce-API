const bcrypt = require("bcryptjs");
const User = require("../models/user.model");


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
    await user.addProfile({ firstName, lastName, photo, });
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
    const user = await User.findByPk(req.params.id);
    await user.update({
      username: req.body.username || user.username,
      role: req.body.role || user.role,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
    });

    const profile = await user.getProfile();
    await profile.update({
      firstName: req.body.firstName || profile.firstName,
      lastName: req.body.lastName || profile.lastName,
    });
    if (req.file) {
      profile.photo = req.file.path;
      await profile.save();
    }

    if (req.body.email) {
      user.emailVerify = false;
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
