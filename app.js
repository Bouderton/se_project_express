const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");

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

// Old hardcoded user
// app.use((req, res, next) => {
//   req.user = {
//     _id: '6610c4f20ecc10975709f402',
//   };
//   next();
// });

app.use(express.json());
app.use("/", mainRouter);
app.use(cors());
