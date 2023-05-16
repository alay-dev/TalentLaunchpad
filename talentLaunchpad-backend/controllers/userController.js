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
    `SELECT * FROM company WHERE user_id = ${user.id} ;`
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
    `SELECT * FROM resume WHERE user_id = ${user.id} ;`
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
    current_salary,
    expected_salary,
    age,
    experience,
    linkedin_link,
    github_link,
    twitter_link,
    facebook_link,
  } = req.body;

  console.log(req.body);

  const { rows: updatedUserRows } = await pool.query(
    `UPDATE users 
    SET bio = '${bio}',
    phone = '${phone}',
    name = '${name}',
    website = '${website}',
    current_salary = '${current_salary}',
    expected_salary = '${expected_salary}',
    age = ${Number(age)},
    experience = '${experience}',
    linkedin_link = '${linkedin_link}',
    github_link = '${github_link}',
    twitter_link = '${twitter_link}',
    facebook_link = '${facebook_link}',
    updated_at = '${new Date().toISOString()}'
    WHERE id = ${user_id}
    RETURNING * ;`
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
    `SELECT * FROM users WHERE id = ${user_id} ;`
  );

  let user = userRows[0];

  const { rows: resumeRows } = await pool.query(
    `SELECT * FROM resume WHERE user_id = ${user.id} ;`
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
    SET avatar = '${req.file.filename}',  
    updated_at = '${new Date().toISOString()}'
    WHERE id = ${user_id}
    RETURNING * ;`
  );

  res.status(200).json({
    status: "success",
    data: {
      ...updatedUserRows[0],
    },
  });
});
