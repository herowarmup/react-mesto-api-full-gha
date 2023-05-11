import { useContext, useEffect } from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';
import { useFormAndValidation } from '../hooks/useFormAndValidation';
import { PopupWithForm } from './PopupWithForm';

function EditProfilePopup({ isOpen, onClose, updateUserInfo }) {
  const currentUser = useContext(CurrentUserContext);
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation();

  useEffect(() => {
    resetForm({
      name: currentUser.name || '',
      about: currentUser.about || '',
    });
  }, [currentUser, isOpen, resetForm]);

  function handleSubmit(e) {
    e.preventDefault();
    updateUserInfo(values);
  }

  return (
    <PopupWithForm
      name='profile'
      title='Редактировать профиль'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      onReset={resetForm}
      isDisabled={!isValid}
    >
      <input
        className='popup__input'
        id='popup-name_profile'
        type='text'
        placeholder='Имя'
        autoComplete='off'
        minLength='2'
        maxLength='40'
        required
        name='name'
        value={values.name || ''}
        onChange={handleChange}
      />
      <span id='popup-name_profile-error' className='error'>
        {errors.name}
      </span>
      <input
        className='popup__input'
        id='popup-about_profile'
        type='text'
        placeholder='О вас'
        autoComplete='off'
        minLength='2'
        maxLength='200'
        required
        name='about'
        value={values.about || ''}
        onChange={handleChange}
      />
      <span id='popup-about_profile-error' className='error'>
        {errors.about}
      </span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
