const Movie = require('../models/movie');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ServerError = require('../errors/server-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({owner: req.user._id})
    .then((movies) => res.send({ data: movies }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(new ServerError(err.message));
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.movieId })
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Видео не найдено.');
      } else if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError('Вы не можете удалять чужие видео.');
      } else {
        return Movie.findByIdAndRemove(req.params.movieId);
      }
    })
    .then((movieId) => {
      res.send({ movieId });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};
