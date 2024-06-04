const { Joi, celebrate } = require("celebrate");

const validator = require("validator");

module.exports.validateNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }),
});
