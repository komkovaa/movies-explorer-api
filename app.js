require('dotenv').config();

console.log(process.env.NODE_ENV);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const errorHandler = require('./errors/error-handler');

const { NODE_ENV, DB_URL } = process.env;

const { PORT = 3003 } = process.env;
const app = express();

app.use(cors({
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(requestLogger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/moviesdb');

app.use(router);

app.use(errorLogger);
app.use(helmet());
app.use(limiter);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
