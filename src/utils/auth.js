/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-20 09:25:03
 * @Description:
 */
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'

const TokenKey = 'Authorization'
const RoleKey = 'AuthorizationRole'

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

export function getRoleToken() {
  return Cookies.get(RoleKey)
}

export function setRoleToken(role) {
  return Cookies.set(RoleKey, role)
}

export function removeRoleToken() {
  return Cookies.remove(RoleKey)
}

