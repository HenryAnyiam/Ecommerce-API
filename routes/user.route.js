const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../middleware/auth.middleware");


const router = express.Router();

router.post("/", userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);

module.exports = router;
