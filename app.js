require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { limiter } = require("./utils/rate-limit-config");

const app = express();
const { PORT = 3001 } = process.env;
const errorHandler = require("./middlewares/errorhandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

app.use(limiter);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use("/", mainRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
