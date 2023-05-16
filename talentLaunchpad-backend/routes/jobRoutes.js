const express = require("express");
const jobsController = require("../controllers/jobsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/user_job", authController.protect, jobsController.getUserJob);

router.get(
  "/get_all_company_jobs/:company_id",
  jobsController.getAllCompanyJobs
);

router.get(
  "/applied_jobs",
  authController.protect,
  jobsController.getAppliedJobs
);

router.get("/", jobsController.getAllJobs);

router.post("/create_job", authController.protect, jobsController.createJob);

router.patch("/update_job", authController.protect, jobsController.updateJob);

router.get("/:id", jobsController.getJob);

router.delete("/:id", authController.protect, jobsController.deleteJob);

router.post("/apply_job", authController.protect, jobsController.applyJob);

router.post("/", authController.protect, jobsController.createJob);

router.post("/get_filtered_jobs", jobsController.getJobsByFilter);

module.exports = router;
