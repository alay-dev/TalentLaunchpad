const express = require("express");
const companyController = require("../controllers/companyController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get(
  "/user_company",
  authController.protect,
  companyController.getUserCompany
);

router.get("/", companyController.getAllCompany);
router.get("/:id", companyController.getCompany);
router.post(
  "/create_company",
  authController.protect,
  companyController.createCompany
);

router.patch(
  "/update_company",
  authController.protect,
  companyController.updateCompany
);

// router.patch("/", authController.protect, companyController.updateCompany);

router.patch(
  "/change_company_logo",
  authController.protect,
  companyController.uploadCompanyLogo,
  companyController.changeCompanyLogo
);

router.delete("/:id", authController.protect, companyController.deleteCompany);

module.exports = router;
