const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { CustomError } = require('./errorHandler');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'secret-phrase-1234');
  } catch (err) {
    return next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
  }

  if (!payload) {
    return next(new CustomError('Необходима авторизация', StatusCodes.UNAUTHORIZED));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
