const catchAsync = require("../utils/catchAsync");
const pool = require("../pool");
const AppError = require("../utils/appError");

exports.getAllCompanyJobs = catchAsync(async (req, res, next) => {
  const company_id = req.params.company_id;

  const { rows: allJobs } = await pool.query(
    `SELECT * FROM jobs WHERE company_id = $1;`,
    [company_id]
  );

  res.status(200).json({
    status: "success",
    results: allJobs.length,
    data: allJobs,
  });
});

exports.getJob = catchAsync(async (req, res, next) => {
  const job_id = req.params.id;

  const { rows: jobRow } = await pool.query(
    `SELECT * FROM jobs WHERE id = $1;`,
    [job_id]
  );

  if (!jobRow.length) {
    return new AppError("No job found with that ID", 404);
  }

  res.status(200).json({
    status: "success",
    data: jobRow[0],
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const {
    companyId,
    jobTitle,
    description,
    jobType,
    qualificationRequired,
    experienceRequired,
    location,
    salary,
    skillsRequired,
    applyLink,
    industry,
    remote,
    urgent,
  } = req.body;
  const user_id = req.user.id;

  const { rows: newJobRows } = await pool.query(
    `
    INSERT INTO jobs ( 
      user_id, 
      job_type, 
      job_title, 
      salary, 
      skills_required, 
      description, 
      apply_link,  
      location, 
      company_id,
      employee_resume,
      experience_required,
      qualification_required,
      industry,
      remote,
      urgent ) 
    VALUES(
      $1, $2, $3, $4, $5, $6, $7, $8,  $9, '', $10, $11, $12, $13, $14
      ) RETURNING *;`,
    [
      user_id,
      jobType,
      jobTitle,
      salary,
      skillsRequired,
      description,
      applyLink,
      location,
      companyId,
      experienceRequired,
      qualificationRequired,
      industry,
      remote,
      urgent,
    ]
  );

  res.status(201).json({
    status: "success",
    data: {
      ...newJobRows[0],
    },
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const {
    jobId,
    jobTitle,
    description,
    jobType,
    qualificationRequired,
    experienceRequired,
    location,
    salary,
    skillsRequired,
    applyLink,
    industry,
    remote,
    urgent,
  } = req.body;
  const user_id = req.user.id;

  console.log("UPDATE job");

  const { rows: updatedJobRows } = await pool.query(
    `
    UPDATE jobs  
      SET job_type = $1, 
      job_title = $2, 
      salary = $3, 
      skills_required = $4,  
      description = $5, 
      apply_link = $6,  
      location = $7, 
      employee_resume = '',
      experience_required = $8,
      qualification_required = $9,
      industry = $10,
      remote = $11,
      urgent = $12,
      updated_at = '${new Date().toISOString()}' 
      WHERE id = $13
    RETURNING *; `,
    [
      jobType,
      jobTitle,
      salary,
      skillsRequired,
      description,
      applyLink,
      location,
      experienceRequired,
      qualificationRequired,
      industry,
      remote,
      urgent,
      jobId,
    ]
  );

  res.status(200).json({
    status: "success",
    data: {
      ...updatedJobRows[0],
    },
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job_id = req.params.id;

  await pool.query(`DELETE FROM jobs where id = $1 ;`, [job_id]);

  res.status(200).json({
    status: "success",
  });
});

// const getApplicants = (myArray) => {
//   const promises = myArray.map(async (item, i) => {
//     const { rows } = await pool.query(
//       `SELECT * FROM users WHERE user_id = ${item.}`
//     );
//     return {
//       id: i,
//       myValue: await service.getByValue(myValue),
//     };
//   });
//   return Promise.all(promises);
// };

exports.getUserJob = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;

  const { rows: jobRows } = await pool.query(
    `SELECT job_title, jobs.industry AS job_industry, jobs.location AS job_location, jobs.created_at AS job_created_at, jobs.id AS job_id, users.id AS user_id, users.name AS user_name, applied_at
    FROM jobs
    FULL JOIN jobs_applied ON jobs_applied.job_id = jobs.id
    FULL JOIN users ON jobs_applied.user_id = users.id
    WHERE jobs.user_id = $1;`,
    [user_id]
  );

  if (!jobRows.length) {
    return new AppError("No job found for that user", 404);
  }

  let data = jobRows.reduce((group, item) => {
    const { job_title } = item;
    group[job_title] = group[job_title] ?? [];
    group[job_title].push(item);
    return group;
  }, {});

  res.status(200).json({
    status: "success",
    data: data,
  });
});

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const { rows: jobRows } = await pool.query(`SELECT * FROM jobs;`);

  res.status(200).json({
    status: "success",
    data: jobRows,
  });
});

exports.applyJob = catchAsync(async (req, res, next) => {
  const { companyId, jobId, message, resme } = req.body;
  const user_id = req.user.id;

  console.log("APPLYING FOR JOB");

  const { rows: newAppliedJob } = await pool.query(
    `
    INSERT INTO jobs_applied ( 
      user_id, 
      job_id,
      message,
      status,
      resume
      ) 
    VALUES(
      $1, 
      $2,
      $3,
      'ACTIVE',
      '') RETURNING *; `,
    [user_id, jobId, message]
  );

  await pool.query(
    `    
    INSERT INTO messages ( 
      from_user, 
      to_company,
      message,
      job_id
      ) 
    VALUES(
      $1, 
      $2,
      $3,
      $4
      ) RETURNING *; `,
    [user_id, companyId, message, jobId]
  );

  res.status(201).json({
    status: "success",
    data: {
      ...newAppliedJob[0],
    },
  });
});

exports.getAppliedJobs = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;

  const { rows: jobRows } = await pool.query(
    `SELECT jobs.id AS id, apply_link, remote, urgent, jobs.created_at AS created_at, jobs.description AS description, employee_resume, experience_required, jobs.industry AS industry, job_title, job_type, jobs.location AS location, qualification_required, salary, skills_required, jobs.updated_at AS updated_at, jobs.user_id AS user_id, company_logo, jobs.company_id as company_id, company_name
    FROM jobs_applied
    JOIN jobs ON jobs_applied.job_id = jobs.id
    FULL JOIN company ON jobs.company_id = company.id
    WHERE jobs_applied.user_id = $1;`,
    [user_id]
  );

  res.status(200).json({
    status: "success",
    data: jobRows,
  });
});

exports.getJobsByFilter = catchAsync(async (req, res, next) => {
  const { searchTerm, location, jobType } = req.body;

  let jobs;

  let jobTypeArray = jobType.map((item) => {
    return `'%${item}%'`;
  });

  jobTypeArray = jobTypeArray.toString();

  if (searchTerm && jobType.length) {
    const { rows: jobRows } = await pool.query(
      `SELECT jobs.id AS id, apply_link, remote, urgent, jobs.created_at AS created_at, jobs.description AS description, employee_resume, experience_required, jobs.industry AS industry, job_title, job_type, jobs.location AS location, qualification_required, salary, skills_required, jobs.updated_at AS updated_at, jobs.user_id AS user_id, company_logo, jobs.company_id as company_id 
    FROM jobs
    JOIN company ON jobs.company_id = company.id
    WHERE LOWER(job_title) LIKE LOWER('%${searchTerm}%')
    AND job_type LIKE ANY(ARRAY[${jobTypeArray}])
    `
    );

    jobs = jobRows;
  } else if (searchTerm && !jobType.length) {
    const { rows: jobRows } = await pool.query(
      `SELECT jobs.id AS id, apply_link, remote, urgent, jobs.created_at AS created_at, jobs.description AS description, employee_resume, experience_required, jobs.industry AS industry, job_title, job_type, jobs.location AS location, qualification_required, salary, skills_required, jobs.updated_at AS updated_at, jobs.user_id AS user_id, company_logo, jobs.company_id as company_id 
    FROM jobs
    JOIN company ON jobs.company_id = company.id
    WHERE LOWER(job_title) LIKE LOWER('%${searchTerm}%')
    `
    );

    jobs = jobRows;
  } else if (!searchTerm && jobType.length) {
    const { rows: jobRows } = await pool.query(
      `SELECT jobs.id AS id, apply_link, remote, urgent, jobs.created_at AS created_at, jobs.description AS description, employee_resume, experience_required, jobs.industry AS industry, job_title, job_type, jobs.location AS location, qualification_required, salary, skills_required, jobs.updated_at AS updated_at, jobs.user_id AS user_id, company_logo, jobs.company_id as company_id 
    FROM jobs
    JOIN company ON jobs.company_id = company.id
    WHERE job_type LIKE ANY(ARRAY[${jobTypeArray}])
    `
    );

    jobs = jobRows;
  } else if (!searchTerm && !jobType.length) {
    const { rows: jobRows } = await pool.query(
      `SELECT jobs.id AS id, apply_link, remote, urgent, jobs.created_at AS created_at, jobs.description AS description, employee_resume, experience_required, jobs.industry AS industry, job_title, job_type, jobs.location AS location, qualification_required, salary, skills_required, jobs.updated_at AS updated_at, jobs.user_id AS user_id, company_logo, jobs.company_id as company_id 
    FROM jobs
    JOIN company ON jobs.company_id = company.id
    `
    );

    jobs = jobRows;
  }

  res.status(200).json({
    status: "success",
    data: jobs,
  });
});
