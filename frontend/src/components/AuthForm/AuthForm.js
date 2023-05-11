import { useFormAndValidation } from '../../hooks/useFormAndValidation';

function AuthForm({ onSubmit, submitButtonText }) {
  const { values, handleChange, errors, isValid, resetForm } = useFormAndValidation();

  function handleFormSubmit(e) {
    e.preventDefault();
    onSubmit(values.email, values.password);
    resetForm();
  }

  return (
    <form className='auth__form' onSubmit={handleFormSubmit} noValidate>
      <input
        className='auth__input'
        type='email'
        name='email'
        id='email'
        autoComplete='off'
        placeholder='E-mail'
        value={values.email?.value}
        onChange={handleChange}
        required
        pattern='^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.\w{2,3}$'
      />
      {errors.email && <span className='auth__input-error'>{errors.email}</span>}
      <input
        className='auth__input'
        type='password'
        name='password'
        id='password'
        autoComplete='off'
        placeholder='Пароль'
        value={values.password?.value}
        onChange={handleChange}
        required
        minLength={6}
      />
      {errors.password && <span className='auth__input-error'>{errors.password}</span>}
      <button className='auth__btn' disabled={!isValid}>
        {submitButtonText}
      </button>
    </form>
  );
}

export default AuthForm;
