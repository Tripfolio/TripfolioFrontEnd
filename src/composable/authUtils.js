import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const TOKEN_NAME = 'user_token';

export function initializeAuth(router) {
  const urlParams = new URLSearchParams(window.location.search);
  const googleToken = urlParams.get('token');

  if (googleToken) {
    localStorage.setItem(TOKEN_NAME, googleToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${googleToken}`;

    const currentPath = window.location.pathname;
    const cleanUrl = window.location.origin + currentPath;
    window.history.replaceState({}, document.title, cleanUrl);

    router.replace('/');
    return;
  }

  const existingToken = localStorage.getItem(TOKEN_NAME);

  if (existingToken) {
    try {
      const payload = jwtDecode(existingToken);
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      if (exp > now) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;

        if (router.currentRoute.value.path === '/login' || router.currentRoute.value.path === '/signup') {
          router.replace('/');
        }
      } else {
        localStorage.removeItem(TOKEN_NAME);
        localStorage.removeItem('memberId');
      }
    } catch (err) {
      localStorage.removeItem(TOKEN_NAME);
      localStorage.removeItem('memberId');
    }
  }
}

export function checkLoginStatus() {
  const token = localStorage.getItem(TOKEN_NAME);
  if (!token) return false;

  try {
    const payload = jwtDecode(token);
    const exp = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch (err) {
    return false;
  }
}

export function logoutUser(router) {
  localStorage.removeItem(TOKEN_NAME);
  localStorage.removeItem('memberId');
  delete axios.defaults.headers.common['Authorization'];
  router.push('/login');
}