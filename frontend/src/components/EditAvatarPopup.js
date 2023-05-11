import { createRef } from 'react';
import { PopupWithForm } from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarInputRef = createRef();

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarInputRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name='avatar'
      title='Обновить аватар'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
        className='popup__input'
        id='popup-name_avatar'
        type='url'
        placeholder='Ссылка на аватар'
        required
        ref={avatarInputRef}
      />
      <span id='popup-name_avatar-error' className='error'></span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
