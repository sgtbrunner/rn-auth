import axios from 'axios';

const { API_KEY } = process.env;

export async function authenticate(mode, email, password) {
  const uri = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  const response = await axios.post(uri, {
    email,
    password,
    returnSecureToken: true,
  });

  const token = response.data.idToken;

  return token;
}

export function createUser(email, password) {
  return authenticate('signUp', email, password);
}

export function loginUser(email, password) {
  return authenticate('signInWithPassword', email, password);
}
