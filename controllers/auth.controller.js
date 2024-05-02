const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const authSecret = process.env.AUTH_SECRET
const bcrypt = require("bcryptjs");

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

    if (bcrypt.compareSync(user.password, password)) {
      const token = jwt.sign({ userId: user.id }, authSecret, { expiresIn: 23200 });
      return res.status(200).json({ token: token });
    }

    return res.status(400).json({ message: "Incorrect Password!" });
  } catch (e) {
    return res.status(400).json({ message: e.message });
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
