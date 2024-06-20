const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const {
  validateNewUser,
  validateReturningUser,
} = require("../middlewares/validation");
const NotFoundError = require("../utils/errors/NotFoundError");

const userRouter = require("./users");
const itemsRouter = require("./clothingItems");

router.post("/signup", validateNewUser, createUser);

router.post("/signin", validateReturningUser, login);

router.use("/items", itemsRouter);

router.use(auth);

router.use("/users", userRouter);

router.use((req, res, next) => next(new NotFoundError("Route not found")));

module.exports = router;
