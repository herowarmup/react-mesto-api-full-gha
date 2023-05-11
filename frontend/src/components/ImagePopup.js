export default function ImagePopup({ onClose, card, isOpen }) {
  return (
    <div className={`popup popup_img ${isOpen ? 'popup_opened' : ''}`} onClick={onClose}>
      <div className='popup__image-wrap' onClick={(e) => e.stopPropagation()}>
        <button
          className='popup__close-btn'
          type='button'
          aria-label='Закрыть'
          onClick={onClose}
        ></button>
        <img className='popup__image' src={card.link} alt={card.name} />
        <p className='popup__text'>{card.name}</p>
      </div>
    </div>
  );
}
