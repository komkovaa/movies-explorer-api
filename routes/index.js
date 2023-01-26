const { Router } = require('express');

const userRouter = require('./users');
const movieRouter = require('./movies');
const { validationUserCreate, validationLogin } = require('../validator/validator');
const { login } = require('../controllers/users');
const { createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

const authRouter = new Router();
const router = new Router();

authRouter.post('/signup', validationUserCreate, createUser);

authRouter.post('/signin', validationLogin, login);

router.use('/', authRouter);
router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.all('/*', (req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

module.exports = router;
