/* eslint-disable consistent-return */
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

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      next(new CustomError('Такой e-mail уже зарегистрирован!', StatusCodes.CONFLICT));
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });

    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    };

    res.status(StatusCodes.CREATED).send({ user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
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
      next(new CustomError('Пользователь не найден', StatusCodes.NOT_FOUND));
    }
    return res.send(updatedUser);
  } catch (err) {
    next(err);
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
    next(err);
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select(password);

    if (!user) {
      next(new CustomError('Пользователь не найден', StatusCodes.UNAUTHORIZED));
    }

    const token = jwt.sign({ _id: user._id }, 'secret-phrase-1234', {
      expiresIn: '7d',
    });

    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    });

    return res.status(StatusCodes.OK).send({ });
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      next(new CustomError('Пользователь не найден', StatusCodes.NOT_FOUND));
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
