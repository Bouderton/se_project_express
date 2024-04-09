const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Failed to create item" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(200).send({ message: "Successfully deleted" });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(404).send({ message: "Item not found" });
      }
      return res.status(500).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const { userId } = req.params;
  ClothingItem.findById(userId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  const { userId } = req.params;
  ClothingItem.findById(userId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(200).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { createItem, getItems, deleteItem, likeItem, dislikeItem };

module.exports.likeItem = (req, res) =>
  ClothingItem.findById(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
    res.status(200).send({ message: "Item liked" }),

    (module.exports.dislikeItem = (req, res) =>
      ClothingItem.findById(
        req.params.itemId,
        { $pull: { likes: req.user._id } },
        { new: true },
        res.status(200).send({ message: "Item disliked" }),
      )),
  );
