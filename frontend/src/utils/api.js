class Api {
  constructor(data) {
    this._baseUrl = data.baseUrl;
    this._headers = data.headers;
  }

  _handleRes(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  _request(url, options) {
    return fetch(url, options).then(this._handleRes);
  }

  getUserInfo() {
    return this._request(`${this._baseUrl}/users/me`, {
      headers: this._headers,
    });
  }

  setUserInfo(data) {
    return this._request(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data),
    });
  }

  updateAvatar(data) {
    return this._request(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data),
    });
  }

  getInitialCards() {
    return this._request(`${this._baseUrl}/cards`, {
      headers: this._headers,
    });
  }

  createCard(data) {
    return this._request(`${this._baseUrl}/cards`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: this._headers,
    });
  }

  deleteCard(id) {
    return this._request(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers,
    });
  }

  setLike(id, isLiked) {
    return this._request(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? 'DELETE' : 'PUT',
      headers: this._headers,
    });
  }
}

const api = new Api({
  baseUrl: 'http://localhost:3000/',
  headers: {
    authorization: 'secret-phrase-1234',
    'Content-Type': 'application/json',
  },
});

export default api;
