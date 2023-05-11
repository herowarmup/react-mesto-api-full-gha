import { NavLink } from 'react-router-dom';
import AuthForm from './AuthForm';

function Login({ handleLogin, loggedIn }) {
  function onSubmit(email, password) {
    handleLogin(email, password);
  }

  if (loggedIn) {
    return <NavLink to='/' />;
  }

  return (
    <div className='auth'>
      <h1 className='auth__title'>Вход</h1>
      <AuthForm onSubmit={onSubmit} submitButtonText='Войти' />
    </div>
  );
}

export default Login;
