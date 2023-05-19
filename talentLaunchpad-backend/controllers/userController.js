const catchAsync = require("../utils/catchAsync");
const pool = require("../pool");
const AppError = require("../utils/appError");
const multer = require("multer");

const userProfilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profilePic/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      req.user.name + Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + file.originalname.split(".")[1]);
  },
});

const profilePicStorage = multer({ storage: userProfilePicStorage });

exports.uploadProfilePic = profilePicStorage.single("avatar");

exports.getProfile = catchAsync(async (req, res, next) => {
  let user = req.user;

  console.log(user);
  delete user.password;

  const { rows: companyRows } = await pool.query(
    `SELECT * FROM company WHERE user_id = $1 ;`,
    [user.id]
  );

  if (companyRows.length) {
    user = {
      ...user,
      company_id: companyRows[0].id,
    };
  } else {
    user = {
      ...user,
      company_id: -1,
    };
  }

  const { rows: resumeRows } = await pool.query(
    `SELECT * FROM resume WHERE user_id = $1 ;`,
    [user.id]
  );

  if (resumeRows.length) {
    user = {
      ...user,
      resume: resumeRows[0].resume_link,
    };
  } else {
    user = {
      ...user,
      resume: "",
    };
  }

  console.log(user, "USER");

  res.status(201).json({
    status: "success",
    data: {
      ...user,
    },
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;

  const {
    bio,
    phone,
    name,
    website,
    currentSalary,
    expectedSalary,
    age,
    experience,
    linkedinLink,
    githubLink,
    twitterLink,
    facebookLink,
    gender,
  } = req.body;

  console.log(req.body);

  const { rows: updatedUserRows } = await pool.query(
    `UPDATE users 
    SET bio = $1,
    phone = $2,
    name = $3,
    website = $4,
    gender = $5,
    current_salary = $6,
    expected_salary = $7,
    age = $8,
    experience = $9,
    linkedin_link = $10,
    github_link = $11,
    twitter_link = $12,
    facebook_link = $13
    updated_at = '${new Date().toISOString()}'
    WHERE id = $14
    RETURNING * ;`,
    [
      bio,
      phone,
      name,
      website,
      gender,
      currentSalary,
      expectedSalary,
      Number(age),
      experience,
      linkedinLink,
      githubLink,
      twitterLink,
      facebookLink,
      user_id,
    ]
  );

  res.status(200).json({
    status: "success",
    data: {
      ...updatedUserRows[0],
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { rows: userRows } = await pool.query(
    `SELECT * FROM users WHERE user_type = 'candidate' ;`
  );

  res.status(200).json({
    status: "success",
    data: userRows,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user_id = req.params.id;

  const { rows: userRows } = await pool.query(
    `SELECT * FROM users WHERE id = $1 ;`,
    [user_id]
  );

  let user = userRows[0];

  const { rows: resumeRows } = await pool.query(
    `SELECT * FROM resume WHERE user_id = $1 ;`,
    [user.id]
  );

  if (resumeRows.length) {
    user = {
      ...user,
      resume: resumeRows[0].resume_link,
    };
  } else {
    user = {
      ...user,
      resume: "",
    };
  }

  res.status(200).json({
    status: "success",
    data: user,
  });
});

exports.changeProfilePic = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;

  if (!req.file.path) {
    return new AppError("Failed to change profile pic. Try again.", 400);
  }

  console.log(req.file);

  const { rows: updatedUserRows } = await pool.query(
    `UPDATE users 
    SET avatar = $1,  
    updated_at = '${new Date().toISOString()}'
    WHERE id = $2
    RETURNING * ;`,
    [req.file.filename, user_id]
  );

  res.status(200).json({
    status: "success",
    data: {
      ...updatedUserRows[0],
    },
  });
});
