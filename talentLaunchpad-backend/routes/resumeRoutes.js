const express = require("express");
const authController = require("../controllers/authController");
const resumeController = require("../controllers/resumeController");

const router = express.Router();

router.get("/:user_id", resumeController.getResume);

router.post(
  "/add_education",
  authController.protect,
  resumeController.addEducation
);

router.post(
  "/add_work_experience",
  authController.protect,
  resumeController.addWorkExperience
);

router.post(
  "/add_project",
  authController.protect,
  resumeController.addProject
);

router.patch(
  "/update_resume",
  authController.protect,
  resumeController.updateResume
);

router.patch(
  "/change_resume",
  authController.protect,
  resumeController.uploadResume,
  resumeController.updateResumeLink
);

router.delete(
  "/remove_education/:education_id",
  authController.protect,
  resumeController.removeEducation
);

router.delete(
  "/remove_work_experience/:work_id",
  authController.protect,
  resumeController.removeWorkExperience
);

module.exports = router;
