const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { errorHandler } = require('./middleware/errorHandler');

const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors({
  origin: ['http://localhost:3001'],
  credentials: true,
}));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger);

app.options('*', cors());

app.use(errors());
app.use(errorHandler);

app.listen(PORT, console.log(`Сервер запущен на ${PORT} порту`));
