require("dotenv").config;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

app.use(cors());
app.use(express.json());
app.use("/", mainRouter);
// You can't use destructuring, and the arguments need to be in the correct order
app.use((err, req, res, next) => {
  console.error(err);
  // you are destructuring INVALID_DATA, which probably doesn't exist on the errors
  const { statusCode = 500, message } = err;

  // send response. If statusCode isn't set on the error, then in the line above
  // we assign to it a value of 500, representing "Internal Server Error" response
  res.status(statusCode).send({
    // if statusCode is 500 we want to send a generic error message
    // otherwise, send the message attached to the error
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});
