/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-16 15:54:36
 * @Description:
 */
import Cookies from 'js-cookie'

const TokenKey = 'Authorization'
const RoleKey = 'AuthorizationRole'

export function getToken() {
  return Cookies.get(TokenKey)
}
export function setToken(token) {
  return Cookies.set(TokenKey, token)
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

