const router = require("express").Router();
const {
  createUser,
  getCurrentUser,
  updateUserInfo,
} = require("../controllers/users");

router.post("/", createUser);

router.get("/me", getCurrentUser);

router.patch("/me", updateUserInfo);

module.exports = router;
