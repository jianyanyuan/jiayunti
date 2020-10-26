import request from '@/utils/request'

const api_prefix_dev = 'auth/'

export function login(data) {
  return request({
    url: api_prefix_dev + 'signin',
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
