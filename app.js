require("dotenv").config;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const app = express();
const { PORT = 3001 } = process.env;
const errorHandler = require("./middlewares/errorhandler");
const { errors } = require("celebrate");

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
app.use(errors());
app.use(errorHandler);
