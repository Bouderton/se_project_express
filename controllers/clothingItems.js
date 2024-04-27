const {
  NOT_FOUND,
  SERVER_ERROR,
  INVALID_DATA,
  FORBIDDEN,
} = require("../utils/errors");

const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: "Invalid Data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "Failed to create item" });
    });
};

const deleteItem = (req, res) => {
  console.log(req.params);
  const { itemId } = req.params;

  ClothingItem.findById({ _id: itemId })
    .orFail()
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(FORBIDDEN)
          .send({ message: "That item is not yours. You cannot delete it" });
      }
      return ClothingItem.findByIdAndRemove({ _id: itemId })
        .then(() => {
          return res.status(200).send({ message: "Item Successfully Deleted" });
        })
        .catch((err) => {
          console.error(err);
          return res
            .status(SERVER_ERROR)
            .send({ message: "Internal server error" });
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA)
          .send({ message: "Invalid Data. Failed to delete item" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error have occured on the server" });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(INVALID_DATA)
          .send({ message: "Invalid Data. Failed to like item" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(200).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(INVALID_DATA).send({ message: "Invalid Data" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};

// module.exports.likeItem = (req, res) => ClothingItem.findByIdAndUpdate(
//   req.params.itemId,
//   { $addToSet: { likes: req.user._id } },
//   { new: true },
//   res.status(200).send({ message: 'Item liked' }),

//   (module.exports.dislikeItem = (req, res) => ClothingItem.findByIdAndUpdate(
// req.params.itemId,
// { $pull: { likes: req.user._id } },
// { new: true },
// res.status(200).send({ message: 'Item disliked' }),
//   )),
// );
