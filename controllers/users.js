const User = require("../models/user");
const {INVALID_DATA, NOT_FOUND, SERVER_ERROR} = require("../utils/errors");

//GET users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send("An error has occured on the server");
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send("Invalid Data. Failed to create user");
      }
      return res.status(SERVER_ERROR).send("An error has occured on the server");
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND).send("User ID not found");
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA).send("Invalid Data");
      }
      return res.status(SERVER_ERROR).send("An error has occured on the server");
    });
};

module.exports = { getUsers, createUser, getUserId };
