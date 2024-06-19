const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

const { JWT_SECRET } = require("../utils/config");

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  // If there is no token or token is invalid, return and 401 Error
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  // defining token payload

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return next(new UnauthorizedError("Authorization Required"));
  }

  req.user = payload;

  next();
};
