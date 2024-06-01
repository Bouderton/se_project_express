const errorHandler = ({ req, res, err, next }) => {
  console.error(err);
  return res.status(500).send({ message: "Internal Server Error" });
};

module.exports = errorHandler;
