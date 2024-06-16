const errorHandler = ({ req, res, err, next }) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  return res
    .status(statusCode)
    .send({ message: statusCode ? "Internal Server Error" : message });
};

module.exports = errorHandler;
