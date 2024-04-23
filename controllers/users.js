const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { INVALID_DATA, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');

// GET users

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(200).send(users))
//     .catch((err) => {
//       console.error(err);
//       return res.status(SERVER_ERROR).send({ message: 'An error has occured on the server' });
//     });
// };

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  // Hashing the Password and Creating User Email
  bcrypt.hash(req.body.password, 10)
  .then((hash) => {
    User.create({
      email: req.body.email,
      password: hash,
    })
    .then((user) => res.send(user))
    .catch((err) => res.status(INVALID_DATA).send(err))
  });

// Creating User Name and Avatar
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA).send({ message: 'Invalid Data. Failed to create user' });
      }
      return res.status(SERVER_ERROR).send({ message: 'An error has occured on the server' });
    });
};

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

module.exports.login = (req, res) => {
  userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return User.findOne({email})
  .then((user) => {
  if(!user) {
    return Promise.reject(new Error('Incorrect email or password'))
  }
  // creating and returning the jwt token
  const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });
  
  res.send({token})
  return bcrypt.compare(pasword, user.password)
  .then((matched) => {
    if(!matched) {
      return Promise.reject(new Error('Incorrect email or password'))
    }
    return user;
    
  })
})
}
  
  
  

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
}


