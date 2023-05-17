const express = require('express');
const mongoose = require('mongoose');

const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const helmet = require('helmet');
const corsHandler = require('./middleware/corsHandler');
const limiter = require('./middleware/limiter');

const { requestLogger, errorLogger } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');

const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(corsHandler);
app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадётт');
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, console.log(`Сервер запущен на ${PORT} порту`));
