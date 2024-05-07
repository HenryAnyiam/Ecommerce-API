const User = require("../models/user.model");


const verifySignup = async (req, res, next) => {
  try {
    let user;

    user = await User.findOne({ where: { email: req.body.email }});
    if (user) {
      return res.status(409).json({ message: "Email already in use!" });
    }

    user = await User.findOne({ where: { phone: req.body.phone }});
    if (user) {
      return res.status(409).json({ message: "Phone Number already in use" });
    }

    next();
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
}

module.exports = verifySignup;
