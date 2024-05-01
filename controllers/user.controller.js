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
    const { username, email, password, role, phone } = req?.body;
    const user = await User.create({
      username,
      email,
      role,
      phone,
      password: password && bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
    });
    return res.status(201).json(user);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}


exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.update()
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
