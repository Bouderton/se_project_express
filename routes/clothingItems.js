const router = require("express").Router();
const { createItem, getItems } = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);

module.exports = router;
