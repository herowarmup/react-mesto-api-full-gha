import { useContext } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext.js';

export function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  const handleCardClick = () => {
    onCardClick(card);
  };

  const handleLikeClick = () => {
    onCardLike(card);
  };

  const handleDeleteClick = () => {
    onCardDelete(card);
  };

  return (
    <div className='card'>
      {isOwn && (
        <button className='card__delete' type='button' onClick={handleDeleteClick}></button>
      )}
      <img src={card.link} alt={card.name} className='card__image' onClick={handleCardClick} />
      <div className='card__description'>
        <h2 className='card__title'>{card.name}</h2>
        <div className='card__like-container'>
          <button
            className={`card__like ${isLiked && 'card__like_active'}`}
            type='button'
            onClick={handleLikeClick}
          ></button>
          <span className='card__like-counter'>{card.likes.length}</span>
        </div>
      </div>
    </div>
  );
}
