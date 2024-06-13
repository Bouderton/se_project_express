const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  INVALID_DATA,
  CONFLICT,
  SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} = require("../utils/errors");

const NotFoundError = require("../utils/errors/NotFoundError");

// Gets current user

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};

// Creates new user

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  // Hashing the Password and Creating User Email
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(CONFLICT).send({ message: "Email already exists" });
    }
    return bcrypt
      .hash(password, 10)
      .then((hash) => {
        User.create({
          email,
          password: hash,
          name,
          avatar,
        })
          .then(() => res.status(200).send({ email, name, avatar }))
          .catch((err) => {
            console.error(err);
            if (err.name === "ValidationError") {
              return res.status(INVALID_DATA).send({ message: "Invalid Data" });
            } else {
              next(err);
            }
            return res
              .status(SERVER_ERROR)
              .send({ message: "Internal server error" });
          });
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(SERVER_ERROR)
          .send({ message: "Internal server error" });
      });
  });
};

// Logging the user in

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  // If email and password fields are empty, return 400 error
  if (!email || !password) {
    return res
      .status(INVALID_DATA)
      .send({ message: "Email and password fields are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // creating a token with a 7 day expiration
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
      console.log("JWT_SECRET: ", process.env.JWT_SECRET);
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

// Update user profile

module.exports.updateUserInfo = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Invalid Data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};
