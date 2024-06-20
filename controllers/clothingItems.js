const ClothingItem = require("../models/clothingItem");

const NotFoundError = require("../utils/errors/NotFoundError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

// Get all items from db

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return next(err);
    });
};

// Create new item

const createItem = (req, res, next) => {
  // console.log(req);
  // console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      }
      next(err);
    });
};

// Deleting and item

const deleteItem = (req, res, next) => {
  console.log(req.params);
  const { itemId } = req.params;

  ClothingItem.findById({ _id: itemId })
    .orFail()
    .then((item) => {
      // No item = No delete
      if (!item) {
        return next(new NotFoundError("Item does not exist."));
      }

      // Owner of the item is not the current user, forbid deletion
      if (!item.owner.equals(req.user._id)) {
        return next(new ForbiddenError("You are not the owner of this item"));
      }
      // Actually deleting the itemWWWWWWWWW
      return ClothingItem.findByIdAndRemove({ _id: itemId })
        .then(() =>
          res.status(200).send({ message: "Item Successfully Deleted" }),
        )
        .catch((err) => {
          console.error(err);
          next(err);
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item does not exist"));
      }
      return next(err);
    });
};

// Liking/Favoriting an item

const likeItem = (req, res, next) => {
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
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid Data. Failed to like item"));
      }
      return next(err);
    });
};

// Disliking/Unfavoriting and item

const dislikeItem = (req, res, next) => {
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
        return next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        return next(
          new BadRequestError("Invalid Data. Failed to dislike item"),
        );
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
