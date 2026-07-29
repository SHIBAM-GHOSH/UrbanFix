const TOKEN_KEY = 'urbanfix_token';

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// A token's presence controls client-side protected routes; the API validates it.
export function isAuthenticated() {
  return Boolean(getToken());
}
