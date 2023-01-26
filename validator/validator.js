const { celebrate, Joi } = require('celebrate');

const { urlLink } = require('../models/user');

module.exports.validationProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

module.exports.validationUserCreate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validationMovieCreate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.number().required().min(0.1),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2),
    image: Joi.string().regex(urlLink).uri({ scheme: ['http', 'https'] }).required(),
    trailerLink: Joi.string().regex(urlLink).uri({ scheme: ['http', 'https'] }).required(),
    thumbnail: Joi.string().regex(urlLink).uri({ scheme: ['http', 'https'] }).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
  }),
});

module.exports.validationMovieDelete = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});
