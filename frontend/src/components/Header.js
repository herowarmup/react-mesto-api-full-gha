import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import logo from '../images/logo.svg';

export default function Header({ exit, email }) {
  return (
    <header className='header'>
      <img className='header__logo' src={logo} alt='Логотип Место' />
      <div className='header__auth'>
        <p className='header__email'>{email}</p>
        <Routes>
          <Route
            path='/sign-up'
            element={
              <Link to='/sign-in' className='header__link'>
                Войти
              </Link>
            }
          />
          <Route
            path='/sign-in'
            element={
              <Link to='/sign-up' className='header__link'>
                Регистрация
              </Link>
            }
          />
          <Route
            path='/'
            element={
              <Link to='/sign-in' className='header__link' onClick={exit}>
                Выйти
              </Link>
            }
          />
          <Route
            path='/'
            element={
              <Link to='/sign-in' className='header__link'>
                Регистрация
              </Link>
            }
          />
        </Routes>
      </div>
    </header>
  );
}
