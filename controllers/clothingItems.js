const ClothingItem = require("../models/clothingItem");

const {
  NOT_FOUND,
  SERVER_ERROR,
  INVALID_DATA,
  FORBIDDEN,
} = require("../utils/errors");

const NotFoundError = require("../utils/errors/NotFoundError");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

// Get all items from db

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occured on the server" });
      next(err);
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
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "Failed to create item" });
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
        next(new NotFoundError("Item does not exist."));
      }

      // Owner of the item is not the current user, forbid deletion
      if (!item.owner.equals(req.user._id)) {
        // return res
        //   .status(FORBIDDEN)
        //   .send({ message: "That item is not yours. You cannot delete it" });
        next(new ForbiddenError("You are not the owner of this item"));
      }
      // Actually deleting the item
      return ClothingItem.findByIdAndRemove({ _id: itemId })
        .then(() =>
          res.status(200).send({ message: "Item Successfully Deleted" }),
        )
        .catch((err) => {
          console.error(err);
          // return res
          //   .status(SERVER_ERROR)
          //   .send({ message: "Internal server error" });
          next(err);
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        // return res
        //   .status(INVALID_DATA)
        //   .send({ message: "Invalid Data. Failed to delete item" });
        next(new BadRequestError("Invalid ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        // return res
        //   .status(NOT_FOUND)
        //   .send({ message: "Item ID does not exist" });
        next(new NotFoundError("Item not found"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error have occured on the server" });
      next(err);
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
        // return res
        //   .status(INVALID_DATA)
        //   .send({ message: "Invalid Data. Failed to like item" });
        return next(new BadRequestError("Invalid Data. Failed to like item"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occured on the server" });
      next(err);
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
        next(new NotFoundError("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data. Failed to dislike item"));
      }
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occured on the server" });
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
