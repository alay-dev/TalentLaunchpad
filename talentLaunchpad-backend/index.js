const express = require("express");
const pool = require("./pool");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const winston = require("winston");
const expressWinston = require("express-winston");

const userRouter = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const messageRoutes = require("./routes/messageRoutes");

const globalErrorHandler = require("./controllers/errorController");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: false,
    msg: "HTTP  ",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
      return false;
    },
  })
);

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.static("uploads"));

//Body Parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/users", userRouter);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/message", messageRoutes);

app.use(globalErrorHandler);

pool
  .connect({
    host: "localhost",
    port: 5432,
    database: "getHired",
    user: "postgres",
    password: "password",
  })
  .then(() => {
    app.listen(4000, () => {
      console.log("Listening on port 4000");
    });
  })
  .catch((err) => console.error(err));
