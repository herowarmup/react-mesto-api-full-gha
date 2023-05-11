import { useFormAndValidation } from '../hooks/useFormAndValidation';
import { PopupWithForm } from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const initialValues = { name: '', link: '' };
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation(initialValues);

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace(values);
    resetForm();
  }

  return (
    <PopupWithForm
      name='place'
      title='Новое место'
      submitText={'Создать'}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isDisabled={!isValid}
    >
      <input
        className='popup__input'
        id='popup-name_place'
        type='text'
        placeholder='Название'
        autoComplete='off'
        minLength='2'
        maxLength='30'
        required
        name='name'
        value={values.name || ''}
        onChange={handleChange}
      />
      <span id='popup-name_place-error' className='error'>
        {errors.name}
      </span>
      <input
        className='popup__input'
        id='popup-about_place'
        type='url'
        placeholder='Ссылка на картинку'
        autoComplete='off'
        required
        name='link'
        value={values.link || ''}
        onChange={handleChange}
      />
      <span id='popup-about_place-error' className='error'>
        {errors.link}
      </span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
