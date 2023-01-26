const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const ServerError = require('../errors/server-error');
const UnauthorizedError = require('../errors/anauthorized-error');
const ConflictError = require('../errors/conflict-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((document) => {
      const user = document.toObject();
      delete user.password;
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с такой почтой уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя.'));
      } else {
        next(err); // по дефолту передаем саму ошибку.
        // Все ошибки с кодом (HTTPError) перейдут в обработчик,
        // а ошибкам, у которых нет кода, в обработчике будет добавлен дефолтный код 500
      }
    });
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильные почта или пароль'));
    });
};

module.exports.currentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateProfileInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя.'));
      } else {
        next(new ServerError(err.message));
      }
    });
};
