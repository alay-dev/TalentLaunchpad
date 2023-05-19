const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/appError");

const catchAsync = require("../utils/catchAsync");
const pool = require("../pool");
const bcrypt = require("bcryptjs");

const correctPassword = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const generatePasswordHash = async (password) => {
  return bcrypt.hash(password, 12);
};

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  //   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  //Remove the password from the output
  user.password = undefined;
  user.confirm_password = undefined;

  res.status(statusCode).json({
    status: "success",
    message,
    data: {
      token,
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide a email and a password", 400));
  }
  //2) cheack if the user exists && password is correct
  const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1 ;`, [
    email,
  ]);

  if (!rows.length) {
    return next(new AppError("User doesn't exist. Try signup.", 404));
  }

  let user = rows[0];
  console.log(user.password, "hello");

  if (!user || !(await correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const { rows: companyRows } = await pool.query(
    `SELECT * FROM company WHERE user_id = $1 ;`,
    [user_id]
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

  //3)if everything is ok send the token

  createSendToken(user, 200, res, "Login sucessful");
});

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, user_type } = req.body;
  const { rows: existingUsers } = await pool.query(
    `SELECT * FROM users WHERE email = $1 ;`,
    [email]
  );

  if (existingUsers.length) {
    return next(new AppError("User already exists.", 400));
  }

  console.log(name, email, password, user_type);

  const passwordHash = await generatePasswordHash(password);

  const { rows: newUser } = await pool.query(
    `
  INSERT INTO users (name, email,password, user_type ) 
  VALUES($1, $2, $3, $4 ) RETURNING *;`,
    [name, email, passwordHash, user_type]
  );

  createSendToken(newUser[0], 201, res, "Signup sucessful");
});

exports.protect = catchAsync(async (req, res, next) => {
  //1)Get Token and ch3eck if it exists
  let token;
  console.log(req.cookies, "[Cookies]");
  if (
    req?.headers?.authorization &&
    req?.headers?.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req?.cookies?.jwt) {
    token = req?.cookies?.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  //2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) check if the user exists
  const { rows: currentUser } = await pool.query(
    `SELECT * FROM users WHERE id = $1 ;`,
    [decoded.id]
  );
  if (!currentUser[0]) {
    return next(new AppError("The user no longer exist", 401));
  }

  //GRNT ACCESS TO PROTECTED ROUTE
  req.user = currentUser[0];
  res.locals.user = currentUser[0];
  next();
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)get user from the collection
  const user_id = req.user.id;
  const { currentPassword, newPassword } = req.body;

  console.log(user_id, currentPassword, req.user.password, "USER");

  //2) check the posted password is correct
  if (!(await correctPassword(currentPassword, req.user.password))) {
    return next(
      new AppError("There is no user or the current password is incorrect", 401)
    );
  }
  //3)if the password is correct Update the password

  const passwordHash = await generatePasswordHash(newPassword);

  const { rows: updatedUserRows } = await pool.query(
    `UPDATE users 
    SET password = $1,  
    updated_at = '${new Date().toISOString()}'
    WHERE id = $2
    RETURNING * ;`,
    [passwordHash, user_id]
  );

  //4) log the user in send jwt
  createSendToken(updatedUserRows[0], 200, res, "Password update sucessful");
});

// exports.checkAdmin = catchAsync(async (req, res, next) => {
//   if (req.user.type !== "A") {
//     return next(new AppError("You do not have permission.", 403));
//   }
//   req.body.type = "A";
//   next();
// });

// exports.addAdmin = catchAsync(async (req, res) => {
//   const newUser = await User.create({
//     name: req.body.name,
//     email: req.body.email,
//     contact_no: req.body.contact_no,
//     password: req.body.password,
//     url: req.body.url,
//     type: req.body.type,
//   });

//   createSendToken(newUser, 201, res, "Signup sucessful");
// });
