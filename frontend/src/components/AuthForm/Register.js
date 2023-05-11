import { NavLink } from 'react-router-dom';
import AuthForm from './AuthForm';

function Register({ handleRegister, loggedIn }) {
  function onSubmit(email, password) {
    handleRegister(email, password);
  }

  if (loggedIn) {
    return <NavLink to='/' />;
  }

  return (
    <div className='auth'>
      <h1 className='auth__title'>Регистрация</h1>
      <AuthForm onSubmit={onSubmit} submitButtonText='Зарегистрироваться' />
    </div>
  );
}

export default Register;
