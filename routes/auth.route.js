const express = require("express");
const authController = require("../controllers/auth.controller");
const verifyToken = require("../middleware/auth.middleware");


const router = express.Router();

router.post("/login", authController.authenticateUser);
router.post("/logout", authController.logoutUser);
router.put("/change-password", verifyToken, authController.changePassword);

module.exports = router;