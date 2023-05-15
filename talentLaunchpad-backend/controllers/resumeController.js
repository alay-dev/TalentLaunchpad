const catchAsync = require("../utils/catchAsync");
const pool = require("../pool");
const AppError = require("../utils/appError");
const multer = require("multer");

const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/resume/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      req.user.name + Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "." + file.originalname.split(".")[1]);
  },
});

const uploadResumeStorage = multer({ storage: resumeStorage });

exports.uploadResume = uploadResumeStorage.single("resume");

exports.updateResumeLink = catchAsync(async (req, res, next) => {
  const user_id = req.user.id;

  if (!req.file.path) {
    return new AppError("Failed to uload CV try again.", 400);
  }

  const { rows: updatedUserRows } = await pool.query(
    `UPDATE resume 
    SET resume_link = '${req.file.filename}',  
    updated_at = '${new Date().toISOString()}'
    WHERE user_id = ${user_id}
    RETURNING * ;`
  );

  res.status(200).json({
    status: "success",
    data: {
      ...updatedUserRows[0],
    },
  });
});

exports.addEducation = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { school, degree, startDate, endDate, description } = req.body;

  let resume_id;

  //   1) Check if resume with user id exits or not
  const { rows: oldResume } = await pool.query(
    `SELECT * FROM resume WHERE user_id = '${user.id}' ;`
  );

  //   2) If not create a resume
  if (!oldResume.length) {
    const { rows: newResume } = await pool.query(`
        INSERT INTO resume (user_id,  description, skills ) 
        VALUES(${user.id}, '', '' ) RETURNING *; 
    `);

    resume_id = newResume[0].id;
  } else {
    resume_id = oldResume[0].id;
  }
  //   3) Add Education

  const { rows: newEducation } = await pool.query(`
        INSERT INTO education (resume_id, degree, institute, start_date, end_date, description ) 
        VALUES(${resume_id}, '${degree}', '${school}', '${startDate}', '${endDate}', '${description}' ) RETURNING *; 
    `);

  console.log(user);

  res.status(201).json({
    status: "success",
    message: "Education added to resume",
  });
});

exports.addWorkExperience = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { company, jobTitle, startDate, endDate, description } = req.body;

  let resume_id;

  //   1) Check if resume with user id exits or not
  const { rows: oldResume } = await pool.query(
    `SELECT * FROM resume WHERE user_id = '${user.id}' ;`
  );

  //   2) If not create a resume
  if (!oldResume.length) {
    const { rows: newResume } = await pool.query(`
          INSERT INTO resume (user_id,  description, skills ) 
          VALUES(${user.id}, '', '' ) RETURNING *; 
      `);

    resume_id = newResume[0].id;
  } else {
    resume_id = oldResume[0].id;
  }
  //   3) Add Work Experience

  const { rows: newWorkExperience } = await pool.query(`
          INSERT INTO work_experience (resume_id, company, job_title, start_date, end_date, description ) 
          VALUES(${resume_id}, '${company}', '${jobTitle}', '${startDate}', '${endDate}', '${description}' ) RETURNING *; 
      `);

  res.status(201).json({
    status: "success",
    message: "Work experience added to resume",
  });
});

exports.addProject = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { projectName, startDate, endDate, description } = req.body;

  let resume_id;

  //   1) Check if resume with user id exits or not
  const { rows: oldResume } = await pool.query(
    `SELECT * FROM resume WHERE user_id = '${user.id}' ;`
  );

  //   2) If not create a resume
  if (!oldResume.length) {
    const { rows: newResume } = await pool.query(`
            INSERT INTO resume (user_id,  description, skills ) 
            VALUES(${user.id}, '', '' ) RETURNING *; 
        `);

    resume_id = newResume[0].id;
  } else {
    resume_id = oldResume[0].id;
  }
  //   3) Add Project

  const { rows: newProject } = await pool.query(`
            INSERT INTO project (resume_id, project_name, start_date, end_date, description ) 
            VALUES(${resume_id}, '${projectName}', '${startDate}', '${endDate}', '${description}' ) RETURNING *; 
        `);

  res.status(201).json({
    status: "success",
    message: "Project added to resume",
  });
});

exports.updateResume = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { skills, description } = req.body;

  let resume_id;

  //   1) Check if resume with user id exits or not
  const { rows: oldResume } = await pool.query(
    `SELECT * FROM resume WHERE user_id = '${user.id}' ;`
  );

  //   2) If not create a resume
  if (!oldResume.length) {
    const { rows: newResume } = await pool.query(`
              INSERT INTO resume (user_id,  description, skills ) 
              VALUES(${user.id}, '${description}', '${skills}' ) RETURNING *; 
        `);

    resume_id = newResume[0].id;
  } else {
    resume_id = oldResume[0].id;

    const { rows: updatedResume } = await pool.query(
      `UPDATE resume
        SET description = '${description}', 
        skills = '${skills}',
        updated_at = '${new Date().toISOString()}'
        WHERE id = ${resume_id}
        RETURNING * ;`
    );
  }

  res.status(200).json({
    status: "success",
    message: "Resume updated",
    data: {
      ...updatedResume[0],
    },
  });
});

exports.getResume = catchAsync(async (req, res, next) => {
  const user_id = req.params.user_id;

  console.log("GET RESUME");
  let resume;
  let resume_id;
  //   1) Check if resume with user id exits or not
  const { rows: oldResume } = await pool.query(
    `SELECT * FROM resume WHERE user_id = '${user_id}' ;`
  );

  //   2) If not create a resume
  if (!oldResume.length) {
    const { rows: newResume } = await pool.query(`
          INSERT INTO resume (user_id,  description, skills ) 
          VALUES(${user_id}, '', '' ) RETURNING *; 
      `);
    resume_id = newResume[0].id;

    resume = newResume[0];
  } else {
    resume_id = oldResume[0].id;
    resume = oldResume[0];
  }

  //   3) get educations
  const { rows: educations } = await pool.query(
    `SELECT * FROM education WHERE resume_id = '${resume_id}' ;`
  );

  //   4) get projects
  const { rows: projects } = await pool.query(
    `SELECT * FROM project WHERE resume_id = '${resume_id}' ;`
  );

  //   5) get projects
  const { rows: workExperience } = await pool.query(
    `SELECT * FROM work_experience WHERE resume_id = '${resume_id}' ;`
  );

  resume = {
    ...resume,
    educations: educations,
    projects: projects,
    work_experience: workExperience,
  };

  res.status(200).json({
    status: "success",
    data: {
      ...resume,
    },
  });
});

exports.removeEducation = catchAsync(async (req, res, next) => {
  const { education_id } = req.params;

  await pool.query(`DELETE FROM education where id = ${education_id} ;`);

  res.status(200).json({
    status: "success",
    message: "Education deleted",
  });
});

exports.removeWorkExperience = catchAsync(async (req, res, next) => {
  const { work_id } = req.params;

  await pool.query(`DELETE FROM work_experience where id = ${work_id} ;`);

  res.status(200).json({
    status: "success",
    message: "Work experience deleted",
  });
});
