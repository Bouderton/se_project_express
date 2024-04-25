const router = require("express").Router();
const { createUser, getCurrentUser } = require("../controllers/users");

router.post("/", createUser);

router.get("/me", getCurrentUser);

module.exports = router;
