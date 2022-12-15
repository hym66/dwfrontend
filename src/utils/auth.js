import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  console.log("获取cookie token "+Cookies.get(TokenKey))
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log("设置cookie token "+token)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
