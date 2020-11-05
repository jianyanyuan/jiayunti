/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-23 14:31:55
 * @Description:
 */
import request from '@/utils/request'
// import qs from 'qs'

const api_prefix_dev = '/auth/'

const login = (data) => {
  return request({
    url: api_prefix_dev + 'signin',
    method: 'post',
    data
  })
}

const regist = (data) => {
  return request({
    url: api_prefix_dev + 'signup',
    method: 'post',
    data
  })
}

const getCode = params => {
  return request({
    url: '/location',
    method: 'get',
    params
  })
}
// export function getInfo(token) {
//   return request({
//     url: api_prefix_dev + 'info',
//     method: 'get',
//     params: { token }
//   })
// }

// export function logout() {
//   return request({
//     url: api_prefix_dev + 'logout',
//     method: 'post'
//   })
// }

export default {
  login,
  regist,
  getCode
}
