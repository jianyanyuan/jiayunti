/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-23 14:31:55
 * @Description:
 */
import request from '@/utils/request'

const api_prefix_dev = '/api/user/'

export function login(data) {
  return request({
    url: api_prefix_dev + 'login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: api_prefix_dev + 'info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: api_prefix_dev + 'logout',
    method: 'post'
  })
}
