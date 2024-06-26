const express = require("express");
const authController = require("../controllers/auth.controller");
const verifyToken = require("../middleware/auth.middleware");


const router = express.Router();

router.post("/login", authController.authenticateUser);
router.post("/verify-totp", authController.verifyTotp);
router.post("/verify-email", authController.verifyEmail);
router.post("/verify-phone", authController.verifyPhone);
router.post("/logout", authController.logoutUser);
router.put("/change-password/:token", authController.changePassword);
router.put("/change-password", verifyToken, authController.changePassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
