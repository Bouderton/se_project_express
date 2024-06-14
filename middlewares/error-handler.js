const errorHandler = ({ req, res, err, next }) => {
  console.error(err);
  const { INVALID_DATA, message } = err;
  return res
    .status(INVALID_DATA)
    .send({ message: INVALID_DATA ? "Internal Server Error" : message });
};

module.exports = errorHandler;
