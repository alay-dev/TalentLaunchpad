const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/profile", authController.protect, userController.getProfile);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUser);

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.patch(
  "/update_password",
  authController.protect,
  authController.updatePassword
);

router.patch(
  "/update_profile",
  authController.protect,
  userController.updateProfile
);

router.patch(
  "/change_profile_pic",
  authController.protect,
  userController.uploadProfilePic,
  userController.changeProfilePic
);

module.exports = router;
