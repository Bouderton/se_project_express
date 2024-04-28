const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  INVALID_DATA,
  DUPE,
  SERVER_ERROR,
  NOT_FOUND,
} = require("../utils/errors");

// Gets current user

module.exports.getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "Internal server error" });
    });
};

// Creates new user

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Hashing the Password and Creating User Email
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(DUPE).send({ message: "Email already exists" });
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
          .then(() => res.status(200).send({ name, avatar, email }))
          .catch((err) => {
            console.error(err);
            return res
              .status(INVALID_DATA)
              .send({ message: "Internal server error" });
          });
      })
      .catch((err) => {
        console.error(err);
        return res
          .status(INVALID_DATA)
          .send({ message: "Internal server error" });
      });
  });
};

// Logging the user in
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (!email || !password) {
        return res
          .status(INVALID_DATA)
          .send({ message: "Email and password fields are required" });
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
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "Not Found") {
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

// OLD CODE vvv

// User.findOne({ email })
//   .then((user) => {
//     bcrypt
//       .hash(password, 10)
//       .then((hash) => {
//         User.create({
//           email,
//           password: hash,
//           name,
//           avatar,
//         });
//       })
//       .catch((err) => {
//         console.error(err)
//         if (error.name === "MongoError" && error.code === 11000) {
//           return res.status(DUPE).send({ message: "Email already exists" });
//         } else {
//           return res
//             .status(INVALID_DATA)
//             .send({ message: "Internal server error" });
//         }
//       });
//   })
//   .catch((err) => res.status(INVALID_DATA).send(err));

// .then((hash) => {
//   User.create({
//     email,
//     password: hash,
//     name,
//     avatar,
//   })})
//   .then((user) => res.send(user))
//   .catch((err) => res.status(INVALID_DATA).send(err))

// User.create({ name, avatar })
//   .then((user) => res.status(201).send(user))
//   .catch((err) => {
//     console.error(err);
//     if (err.name === 'ValidationError') {
//       return res.status(INVALID_DATA).send({ message: 'Invalid Data. Failed to create user' });
//     }
//     return res.status(SERVER_ERROR).send({ message: 'An error has occured on the server' });
//   });

// const getUserId = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === 'DocumentNotFoundError') {
//         res.status(NOT_FOUND).send({ message: 'User ID not found' });
//       }
//       if (err.name === 'CastError') {
//         res.status(INVALID_DATA).send({ message: 'Invalid Data' });
//       }
//       return res.status(SERVER_ERROR).send({ message: 'An error has occured on the server' });
//     });
// };

// User.findOne({email})
// .then((user) => {
//   if(!user) {
//     // user not found
//     return Promise.reject(new Error('Incorrect email or password'))
//   }
//   return bcrypt.compare(password, user.password)
// })
// .then((matched) => {
//   if(!matched) {
//     return Promise.reject(new Error('Incorrect email or pasword'))
//   }
// })
// .catch((err) => res.status(SERVER_ERROR).send(err));
