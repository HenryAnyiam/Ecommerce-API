const jwt = require("jsonwebtoken");
const authSecret = process.env.AUTH_SECRET;


const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers("authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Please provide token <authorization: Auth Token>" });
    }

    jwt.verify(token, authSecret, (err, user) => {
      if (err) {
	return res.status(401).json({ message: `Unauthorzied! ${err.message}` });
      }

      req.user = user;
      next();
    });
  } catch (e) {
    return res.status(500).json({ message: "Authorization Error!" });
  }
}

module.exports = verifyToken;
