/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-11 13:55:01
 * @Description:
 */
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'

const TokenKey = 'Authorization'

export function getToken() {
  // 取出解密
  const token = Cookies.get(TokenKey)
  if (token) {
    return Base64.decode(token)
  }
  return token
}
export function setToken(token) {
  // 加密存储
  return Cookies.set(TokenKey, Base64.encode(token))
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

