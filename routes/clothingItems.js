const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.use(auth);
router.post("/", createItem);
router.delete("/:itemsId", deleteItem);
router.put("/:itemsId/likes", likeItem);
router.delete("/:itemsId/likes", dislikeItem);

module.exports = router;
