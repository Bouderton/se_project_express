const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
// const {
//   INVALID_DATA,
//   CONFLICT,
//   SERVER_ERROR,
//   NOT_FOUND,
//   UNAUTHORIZED,
// } = require("../utils/errors");

const NotFoundError = require("../utils/errors/NotFoundError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const ConflictError = require("../utils/errors/ConflictError");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

// Gets current user

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        // return res.status(NOT_FOUND).send({ message: "User not found" });
        next(new NotFoundError("User not found"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "Internal server error" });
      next(err);
    });
};

// Creates new user

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  // Hashing the Password and Creating User Email
  User.findOne({ email }).then((user) => {
    if (user) {
      // return res.status(CONFLICT).send({ message: "Email already exists" });
      next(new ConflictError("User already exists"));
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
              // return res.status(INVALID_DATA).send({ message: "Invalid Data" });
              next(new BadRequestError("Invalid Data"));
            }
            next(err);
          });
      })
      .catch((err) => {
        console.error(err);
        // return res
        //   .status(SERVER_ERROR)
        //   .send({ message: "Internal server error" });
        next(err);
      });
  });
};

// Logging the user in

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  // If email and password fields are empty, return 400 error
  if (!email || !password) {
    // return res
    //   .status(INVALID_DATA)
    //   .send({ message: "Email and password fields are required" });
    next(new BadRequestError("Email and password fields are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // creating a token with a 7 day expiration
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        // return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
        next(new UnauthorizedError("Unauthorized"));
      }
      next(err);
    });
};

// Update user profile

module.exports.updateUserInfo = (req, res, next) => {
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
        // return res.status(NOT_FOUND).send({ message: "User not found" });
        next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        // return res.status(INVALID_DATA).send({ message: "Invalid Data" });
        next(new BadRequestError("Invalid Data"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "Internal server error" });
      next(err);
    });
};
