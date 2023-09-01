const Joi = require("joi");
module.exports.joiSchemaCampground = Joi.object({
  campground: Joi.object({
    name: Joi.string().min(3).required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    image: Joi.string().required(),
  }).required(),
});

module.exports.joiSchemaReview = Joi.object({
  review: Joi.object({
    text: Joi.string().min(3).required(),
    rating: Joi.number().min(0).required(),
  }).required(),
});

module.exports.userSchemaReview = Joi.object({
  user: Joi.object({
    username: Joi.string().min(3).required(),
    firstname: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
});
