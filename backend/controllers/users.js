/* eslint-disable consistent-return */
const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/user');
const { CustomError } = require('../middleware/errorHandler');

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
}

async function getUser(req, res, next) {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      next(new CustomError('Пользователь не найден', StatusCodes.NOT_FOUND));
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new CustomError('Переданы некорректные данные', StatusCodes.BAD_REQUEST));
    } else {
      next(err);
    }
  }
}

async function createUser(req, res, next) {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      name,
      about,
      avatar,
      password: hash,
    }))
    .then((user) => {
      res.status(StatusCodes.CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new CustomError('Пользователь с таким email уже существует', StatusCodes.CONFLICT));
      } else if (err.name === 'ValidationError') {
        next(new CustomError('Проверьте правильность данных', StatusCodes.BAD_REQUEST));
      } else {
        next(err);
      }
    });
}

async function updateUser(req, res, next) {
  const { name, about } = req.body;

  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      return next(new CustomError('Пользователь не найден', StatusCodes.NOT_FOUND));
    }
    return res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new CustomError('Проверьте правильность данных', StatusCodes.BAD_REQUEST));
    } else {
      next(err);
    }
  }
}

async function updateAvatar(req, res, next) {
  const { avatar } = req.body;

  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new CustomError('Проверьте правильность данных', StatusCodes.BAD_REQUEST));
    } else {
      next(err);
    }
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return next(new CustomError('Пользователь не найден', StatusCodes.UNAUTHORIZED));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return next(new CustomError('Неверный пароль', StatusCodes.UNAUTHORIZED));
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'secret-phrase-1234',
      { expiresIn: '7d' },
    );

    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      // sameSite: true,
    });

    return res.status(StatusCodes.OK).send({ token });
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new CustomError('Пользователь не найден', StatusCodes.NOT_FOUND));
    }
    return res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
