const { Joi, celebrate } = require("celebrate");

const validator = require("validator");

// separate url validation function
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// New user
module.exports.validateNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().url(),
  }),
});

// Returning user
module.exports.validateReturningUser = celebrate({
  body: Joi.object.keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Item validation
module.exports.validateItem = celebrate({
  body: Joi.object.keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field isn 30',
      "string.empty": 'The "name" field mus be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});
