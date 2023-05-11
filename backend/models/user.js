const mongoose = require('mongoose');
const validator = require('validator');

const defaultName = 'Жак-Ив Кусто';
const defaultAbout = 'Исследователь';
const defaultAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email должен быть заполнен'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Введен неккоректный email или пароль',
    },
  },
  password: {
    type: String,
    required: [true, 'Password должен быть заполнен'],
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина имени - 2 символа'],
    maxlength: [30, 'Максимальная длина имени - 30 символов'],
    default: defaultName,
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина информации о пользователе - 2 символа'],
    maxlength: [30, 'Максимальная длина информации о пользователе - 30 символов'],
    default: defaultAbout,
  },
  avatar: {
    type: String,
    default: defaultAvatar,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
