const mongoose = require("mongoose");

const clothingItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  imageURL: {
    type: URL,
    required: true,
    // MAKE SURE IT MATCHES EITHER HOT COLD OR WARM
    validator(value) {
      return validator.isURL(value);
    },
    message: "You must enter a valid URL",
  },
});

module.exports = mongoose.model("item", clothingItemsSchema);
