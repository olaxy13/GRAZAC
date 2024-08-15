const express = require("express");
const morgan = require("morgan")
const globalErrorHandler = require("./controller/errorController");
// const helmet = require('helmet');

const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });


const AppError = require("./utils/appError")
//ROUTES
const bookRouter = require("./routes/bookRoutes")
const userRouter = require("./routes/userRoutes")

const app =  express()

if (process.env.NODE_ENV === "development") {
  app.use(morgan('dev'));
}

app.use(express.json())
app.use("/test", async (req, res) => {
  res.status(200).send({ success: true });
});

// app.use(
//   helmet({
//       contentSecurityPolicy: false,
//   })
// )

app.use("/api/books", bookRouter);
app.use("/api/user", userRouter);

app.all("*", (req, res, next)=> {
  next(new AppError(`Can't find ${req.originalUrl} on this server`))
  })
  

app.use(globalErrorHandler)

  module.exports = app
 