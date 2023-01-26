const movieRouter = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validationMovieCreate, validationMovieDelete } = require('../validator/validator');

movieRouter.get('/', getMovies);

movieRouter.delete('/:movieId', validationMovieDelete, deleteMovie);

movieRouter.post('/', validationMovieCreate, createMovie);

module.exports = movieRouter;
