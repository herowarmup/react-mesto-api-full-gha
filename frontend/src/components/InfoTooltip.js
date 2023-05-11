import succesIco from '../images/success.svg';
import errorIco from '../images/error.svg';

export default function InfoTooltip({ isOpen, onClose, err }) {
  return (
    <div className={`popup popup_auth ${isOpen ? 'popup_opened' : ''}`} onClick={onClose}>
      <div className='popup__wrap' onClick={(e) => e.stopPropagation()}>
        <button
          className='popup__close-btn'
          type='button'
          aria-label='Закрыть'
          onClick={onClose}
        ></button>
        <img className='popup__auth-ico' src={!err ? succesIco : errorIco} alt={err} />
        <p className='popup__auth-title'>
          {!err ? 'Вы успешно зарегистрировались!' : 'Что то пошло не так! Попробуйте еще раз!'}
        </p>
      </div>
    </div>
  );
}
