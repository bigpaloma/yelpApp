const Joi = require("joi");
module.exports.joiSchemaCampground = Joi.object({
    campground: Joi.object({
        name: Joi.string().min(3).required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(0).required(),
        image: Joi.string().required()
    }).required()
});

module.exports.joiSchemaCampground = Joi.object({
    review: Joi.object({
        text: Joi.string().min(3).required(),
        rating: Joi.number().min(0).required()
    }).required()
});