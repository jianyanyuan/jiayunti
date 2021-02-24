/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-25 16:13:56
 * @Description:
 */
import request from '@/utils/request'
// import qs from 'qs'

const api_prefix_dev = '/auth'

const login = (data) => {
  return request({
    url: api_prefix_dev + '/signin',
    method: 'post',
    data
  })
}

const regist = (data) => {
  return request({
    url: api_prefix_dev + '/signup',
    method: 'post',
    data
  })
}
// 获取短信验证码
const getCode = params => {
  return request({
    url: '/sendsms/getSendsms',
    method: 'get',
    params
  })
}

// 获取用户信息（角色....）
const getUserInfo = () => {
  return request({
    url: '/users/me',
    method: 'get'
  })
}
// 找回密码
const findPwd = (data) => {
  return request({
    url: '/auth/retrievePassword',
    method: 'post',
    data
  })
}

// 修改密码
const modifyPwd = (data) => {
  return request({
    url: '/auth/resetPwd',
    method: 'post',
    data
  })
}
// export function logout() {
//   return request({
//     url: api_prefix_dev + 'logout',
//     method: 'post'
//   })
// }

export default {
  login,
  regist,
  getCode,
  getUserInfo,
  findPwd,
  modifyPwd
}
