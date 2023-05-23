const catchAsync = require("../utils/catchAsync");
const pool = require("../pool");
const AppError = require("../utils/appError");

exports.sendMessage = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;

  const { fromCompany, toUser, fromUser, toCompany, message } = req.body;

  console.log(toCompany, fromUser);

  const { rows: messageRow } = await pool.query(
    `
    INSERT INTO messages (
        from_company,
        to_user,
        from_user,
        to_company, 
        message
    )
    VALUES ($1, $2, $3, $4, $5) RETURNING * `,
    [fromCompany, toUser, fromUser, toCompany, message]
  );

  res.status(201).json({
    status: "success",
    message: "Message sent",
    data: messageRow[0],
  });
});

exports.getChat = catchAsync(async (req, res, next) => {
  // const user_id = req.user.id;
  const { companyId, userId } = req.body;

  const { rows: messageRow } = await pool.query(
    `
    SELECT * 
    FROM messages
    WHERE (from_user = $1 AND to_company = $2) OR (from_company = $2 AND to_user = $1) 
    ORDER BY created_at ASC ;
    `,
    [userId, companyId]
  );

  res.status(200).json({
    status: "success",
    data: messageRow,
  });
});

exports.getAllCandidateConversation = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;

  const { rows: messageRow } = await pool.query(
    `
    SELECT  
    DISTINCT ON (to_company, from_user) company_name, company.id  as company_id, company_logo, applied_at
    FROM messages
    JOIN company ON company.id = messages.to_company
    JOIN jobs_applied ON jobs_applied.job_id = messages.job_id 
    WHERE from_user = $1;
    `,
    [user_id]
  );

  res.status(200).json({
    status: "success",
    data: messageRow,
  });
});

exports.getAllEmployerConversation = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;
  const { companyId } = req.body;

  const { rows: messageRow } = await pool.query(
    `
    SELECT  
    DISTINCT ON (from_company, to_user) users.name as user_name, avatar, applied_at , users.id as user_id
    FROM messages
    JOIN users ON users.id = messages.from_user
    JOIN jobs_applied ON jobs_applied.job_id = messages.job_id 
    WHERE to_company = $1;
    `,
    [companyId]
  );

  res.status(200).json({
    status: "success",
    data: messageRow,
  });
});
