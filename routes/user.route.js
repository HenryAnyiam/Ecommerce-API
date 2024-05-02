const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../middleware/auth.middleware");
const upload = require("../middleware/storage.middleware");


const router = express.Router();

router.post("/", upload.single("photo"), userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id", verifyToken, upload.single("photo"), userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);
router.get("/:id/profile", userController.getProfileById);

module.exports = router;
