const BASE_URL = 'http://localhost:3000';

async function request(url, method, body, token) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options = {
    method,
    credentials: 'include',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${BASE_URL}${url}`, options);
  if (!response.ok) {
    const message = await response.json();
    if (message.error) {
      throw new Error(message.error);
    } else if (message.message) {
      throw new Error(message.message);
    } else {
      throw new Error(`Request status:${response.status}`);
    }
  }

  return await response.json();
}

export const register = (email, password) => {
  return request('/signup', 'POST', { email, password });
};

export const login = (email, password) => {
  return request('/signin', 'POST', { email, password })
};

export const checkToken = (token) => {
  return request('/users/me', 'GET', null, token);
};
