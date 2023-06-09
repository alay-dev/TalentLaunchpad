const catchAsync = require("../utils/catchAsync");
const pool = require("../pool");
const AppError = require("../utils/appError");
const multer = require("multer");

const comapnyLogoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/company/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      req.user.name + Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + file.originalname.split(".")[1]);
  },
});

const companyStorage = multer({ storage: comapnyLogoStorage });

exports.uploadCompanyLogo = companyStorage.single("companyLogo");

exports.getAllCompany = catchAsync(async (req, res, next) => {
  const { rows: allCompany } = await pool.query(`SELECT * FROM company;`);

  res.status(200).json({
    status: "success",
    results: allCompany.length,
    data: allCompany,
  });
});

exports.getUserCompany = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;

  const { rows: companyRow } = await pool.query(
    `SELECT * FROM company WHERE user_id = $1`,
    [user_id]
  );

  if (!companyRow.length) {
    return new AppError("No company found for that user", 404);
  }

  res.status(200).json({
    status: "success",
    data: companyRow[0],
  });
});

exports.getCompany = catchAsync(async (req, res, next) => {
  const company_id = req.params.id;

  const { rows: companyRow } = await pool.query(
    `SELECT * FROM company WHERE id = $1`,
    [company_id]
  );

  if (!companyRow.length) {
    return new AppError("No company found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    data: companyRow[0],
  });
});

exports.createCompany = catchAsync(async (req, res, next) => {
  const {
    companyName,
    email,
    phone,
    website,
    estSince,
    companySize,
    aboutCompany,
    linkedinLink,
    googlePlusLink,
    twitterLink,
    facebookLink,
    country,
    city,
    completeAddress,
    primaryIndustry,
  } = req.body;
  const user_id = req.user.id;

  const location = `${city}, ${country}`;

  const { rows: companyRow } = await pool.query(
    `SELECT * FROM company WHERE user_id = $1`,
    [user_id]
  );

  if (companyRow.length) {
    return next(new AppError("Company already exits try editing.", 400));
  }

  const { rows: newCompanyRows } = await pool.query(
    `
  INSERT INTO company (
    user_id, 
    company_name, 
    location, 
    description, 
    est_since,
    company_size, 
    phone, 
    email, 
    facebook_link, 
    twitter_link, 
    google_plus_link, 
    linkedin_link, 
    website,
    complete_address,
    primary_industry
  ) 
  VALUES(
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
   ) RETURNING *;`,
    [
      user_id,
      companyName,
      location,
      aboutCompany,
      estSince,
      companySize,
      phone,
      email,
      facebookLink,
      twitterLink,
      googlePlusLink,
      linkedinLink,
      website,
      completeAddress,
      primaryIndustry,
    ]
  );

  res.status(201).json({
    status: "success",
    data: {
      ...newCompanyRows[0],
    },
  });
});

exports.updateCompany = catchAsync(async (req, res, next) => {
  console.log("UPDATE COMPANY");
  const {
    companyName,
    email,
    phone,
    website,
    estSince,
    companySize,
    aboutCompany,
    linkedinLink,
    googlePlusLink,
    twitterLink,
    facebookLink,
    country,
    city,
    completeAddress,
    primaryIndustry,
  } = req.body;
  const user_id = req.user.id;

  const location = `${city}, ${country}`;

  const { rows: companyRow } = await pool.query(
    `SELECT * FROM company WHERE user_id = $1`,
    [user_id]
  );

  if (!companyRow.length) {
    return next(new AppError("Company does not exists try adding.", 400));
  }

  const { rows: updatedCompanyRows } = await pool.query(
    `
  UPDATE company 
    SET company_name  = $1, 
    location = $2, 
    description = $3, 
    est_since = $4,
    company_size = $5, 
    phone = $6, 
    email = $7, 
    facebook_link = $8,  
    twitter_link = $9, 
    google_plus_link = $10, 
    linkedin_link = $11,
    website = $12,
    complete_address = $13,
    primary_industry  = $14,
    updated_at = '${new Date().toISOString()}'
    WHERE user_id = $15
    RETURNING *;`,
    [
      companyName,
      location,
      aboutCompany,
      estSince,
      companySize,
      phone,
      email,
      facebookLink,
      twitterLink,
      googlePlusLink,
      linkedinLink,
      website,
      completeAddress,
      primaryIndustry,
      user_id,
    ]
  );

  res.status(200).json({
    status: "success",
    message: "Company details updated",
    data: {
      ...updatedCompanyRows[0],
    },
  });
});

exports.deleteCompany = catchAsync(async (req, res, next) => {
  const company_id = req.params.id;

  await pool.query(`DELETE FROM company where id = $1 ;`, [company_id]);

  res.status(200).json({
    status: "success",
  });
});

exports.getAllCompany = catchAsync(async (req, res, next) => {
  const { rows: companyRows } = await pool.query(`SELECT * FROM company;`);

  res.status(200).json({
    status: "success",
    data: companyRows,
  });
});

exports.changeCompanyLogo = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;

  if (!req.file.path) {
    return new AppError("Failed to change company logo. Try again.", 400);
  }

  const { rows: companyRow } = await pool.query(
    `SELECT * FROM company WHERE user_id = $1`,
    [user_id]
  );

  if (!companyRow?.length) {
    await pool.query(`INSERT INTO company(user_id) VALUES($1) RETURNING *`, [
      user_id,
    ]);
  }

  const { rows: updatedCompanyRows } = await pool.query(
    `UPDATE  company
    SET company_logo = $1,  
    updated_at = '${new Date().toISOString()}'
    WHERE user_id = $2
    RETURNING * ;`,
    [req.file.filename, user_id]
  );

  res.status(200).json({
    status: "success",
    data: {
      ...updatedCompanyRows[0],
    },
  });
});
