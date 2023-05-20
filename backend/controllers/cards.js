/* eslint-disable consistent-return */
const { StatusCodes } = require('http-status-codes');

const Card = require('../models/card');
const { CustomError } = require('../middleware/errorHandler');

function getCards(req, res, next) {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => card.populate('owner'))
    .then((card) => res.status(StatusCodes.CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new CustomError('Некорректные данные при создании карточки', StatusCodes.BAD_REQUEST));
      } else {
        next(err);
      }
    });
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
    .catch(next);
}

async function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new CustomError('Карточка не найдена', StatusCodes.NOT_FOUND));
      }
      return Card.findByIdAndUpdate(
        cardId,
        { $pull: { likes: userId } },
        { new: true },
      )
        .then((cardForDislikeLike) => cardForDislikeLike.populate(['owner', 'likes']))
        .then((cardForDislikeLike) => { res.send(cardForDislikeLike); });
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
