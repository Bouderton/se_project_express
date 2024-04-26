const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

const userRouter = require("./users");
const itemsRouter = require("./clothingItems");

router.post("/signup", createUser);

router.post("/signin", login);

router.use(auth);

router.use("/users", userRouter);

router.use("/items", itemsRouter);

router.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: "Route not found" });

  next();
});

module.exports = router;
