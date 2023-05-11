import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import CurrentUserContext from '../contexts/CurrentUserContext';
import api from '../utils/api';
import * as auth from '../utils/authApi';

import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Login from './AuthForm/Login';
import Register from './AuthForm/Register';

import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';
import ImagePopup from './ImagePopup';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [toolTipInfo, setToolTipInfo] = useState({ errorMessage: '', isOpen: false });
  const navigate = useNavigate();

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleCardClick(data) {
    setSelectedCard(data);
    setImagePopupOpen(true);
  }
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setImagePopupOpen(false);
    setToolTipInfo(false);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .setLike(card._id, isLiked)
      .then((newCard) => {
        setCards(cards.map((с) => (с._id === newCard._id ? newCard : с)));
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUserInfo(userData) {
    api
      .setUserInfo(userData)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(userData) {
    api
      .updateAvatar(userData)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(userData) {
    api
      .createCard(userData)
      .then((newUserData) => {
        setCards([newUserData, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleLogin(email, password) {
    auth
      .login(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log(data)
          setLoggedIn(true);
          setEmail(email);
          navigate('/', { replace: true });
        }
      })
      .catch((err) =>
        setToolTipInfo({
          errorMessage: err.message,
          isOpen: true,
        })
      );
  }

  function handleRegister(email, password) {
    auth
      .register(email, password)
      .then(() => {
        setToolTipInfo({
          errorMessage: '',
          isOpen: true,
        });
      })
      .catch((err) => setToolTipInfo({ errorMessage: err.message, isOpen: true }));
  }

  function handleLogout() {
    setLoggedIn(false);
    setEmail('');
    localStorage.removeItem('token');
    navigate('/sign-in', { replace: true });
  }

  const handleTokenCheck = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth
        .checkToken(token)
        .then(({ data }) => {
          setLoggedIn(true);
          setEmail(data.email);
          navigate('/', { replace: true });
        })
        .catch((err) => console.log(err));
    }
  }, [navigate]);

  useEffect(() => {
    handleTokenCheck();
  }, [handleTokenCheck]);

  useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch((err) => {
          console.log(err);
        });

      api
        .getInitialCards()
        .then((data) => {
          setCards(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header exit={handleLogout} email={email} />

      <Routes>
        <Route path='/sign-in' element={<Login handleLogin={handleLogin} loggedIn={loggedIn} />} />
        <Route
          path='/sign-up'
          element={<Register handleRegister={handleRegister} loggedIn={loggedIn} />}
        />
        <Route
          path='/'
          element={
            <ProtectedRoute
              exact
              path='/'
              element={Main}
              loggedIn={loggedIn}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              cards={cards}
            />
          }
        ></Route>
      </Routes>
      <Footer />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        updateUserInfo={handleUpdateUserInfo}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />

      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <ImagePopup card={selectedCard} isOpen={imagePopupOpen} onClose={closeAllPopups} />

      <InfoTooltip
        isOpen={toolTipInfo.isOpen}
        onClose={closeAllPopups}
        err={toolTipInfo.errorMessage}
        text={toolTipInfo.text}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
