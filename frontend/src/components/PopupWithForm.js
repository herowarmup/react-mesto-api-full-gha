export function PopupWithForm({
  name,
  isOpen,
  onClose,
  title,
  children,
  submitText,
  onSubmit,
  isDisabled,
}) {
  return (
    <div className={`popup popup_${name} ${isOpen ? 'popup_opened' : ''}`} onClick={onClose}>
      <div className='popup__wrap' onClick={(e) => e.stopPropagation()}>
        <button
          className='popup__close-btn'
          type='button'
          aria-label='Закрыть'
          onClick={onClose}
        ></button>
        <h2 className='popup__title'>{title}</h2>
        <form
          className={`popup__form popup__form-${name}`}
          name={name}
          noValidate
          onSubmit={onSubmit}
        >
          {children}
          <button className='popup__submit-btn' type='submit' disabled={isDisabled}>
            {submitText || 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  );
}
