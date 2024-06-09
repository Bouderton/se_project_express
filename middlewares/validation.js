const { Joi, celebrate } = require("celebrate");

const validator = require("validator");

module.exports.validateNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().url(),
  }),
});

module.exports.validateReturningUser = celebrate({
  body: Joi.object.keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validate;
