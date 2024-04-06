const router = require("express").Router();
const { getUsers } = require("../controllers/users");

router.get("/", getUsers);

router.get("/:userId", () => console.log("GET users by Id"));

router.post("/", () => console.log("POST users"));

module.exports = router;
