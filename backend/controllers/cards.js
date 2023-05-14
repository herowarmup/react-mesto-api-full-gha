/* eslint-disable consistent-return */
const { StatusCodes } = require('http-status-codes');

const Card = require('../models/card');
const { CustomError, errorHandler } = require('../middleware/errorHandler');

async function getCards(req, res, next) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
}

async function createCard(req, res, next) {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    next(err);
  }
}

async function deleteCard(req, res, next) {
  try {
    const card = await Card.findOne({ _id: req.params.cardId });
    if (!card) {
      next(new CustomError('Карточка не найдена', StatusCodes.NOT_FOUND));
    } else if (card.owner.toString() !== req.user._id) {
      next(new CustomError('Нельзя удалять чужие карточки', StatusCodes.FORBIDDEN));
    } else {
      const deletedCard = await Card.findByIdAndRemove(req.params.cardId);
      res.send({ data: deletedCard });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new CustomError('Переданы некорректные данные', StatusCodes.BAD_REQUEST));
    } else {
      next(err);
    }
  }
}

async function likeCard(req, res, next) {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new CustomError('Карточка не найдена', StatusCodes.NOT_FOUND));
      }
      return Card.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: userId } },
        { new: true },
      )
        .then((cardForLike) => cardForLike.populate(['owner', 'likes']))
        .then((cardForLike) => { res.send(cardForLike); });
    })
    .catch(() => {
      next(errorHandler);
    });
}

async function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findOneAndUpdate(
      { _id: cardId, likes: userId },
      { $pull: { likes: userId } },
      { new: true, runValidators: true },
    );
    if (!card) {
      return next(new CustomError('Карточка не найдена', StatusCodes.NOT_FOUND));
    }
    res.send({ data: card });
  } catch (err) {
    if (err.name === 'CastError') {
      next(new CustomError('Переданы некорректные данные', StatusCodes.BAD_REQUEST));
    } else {
      next(err);
    }
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
