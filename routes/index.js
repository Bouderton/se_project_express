const router = require("express").Router();

const userRouter = require("./users");
const itemsRouter = require("./clothingItems");

router.use((req, res) => {
    return res.status(404).send("Route not found");
})

router.use("/users", userRouter);
router.use("/items", itemsRouter);

module.exports = router;
