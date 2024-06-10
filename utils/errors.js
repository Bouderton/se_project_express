// class CustomError extends Error {
//   constructor(message, statusCode) {
//     super(message);
//     this.statusCode = statusCode;
//   }
// }

// const handleError = (err, message, next) => {
//   if (err.message === "ValidationError") {

//   }
// };

const NOT_FOUND = 404;

const FORBIDDEN = 403;

const SERVER_ERROR = 500;

const INVALID_DATA = 400;

const CONFLICT = 409;

const UNAUTHORIZED = 401;

module.exports = {
  FORBIDDEN,
  NOT_FOUND,
  SERVER_ERROR,
  INVALID_DATA,
  CONFLICT,
  UNAUTHORIZED,
};
