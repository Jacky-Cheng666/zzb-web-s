export function getToken(TokenKey) {
  return JSON.parse(window.localStorage.getItem(TokenKey))
}

export function setToken(TokenKey,token) {
  return window.localStorage.setItem(TokenKey, JSON.stringify(token))
}

export function removeToken(TokenKey) {
  return window.localStorage.removeItem(TokenKey)
}
