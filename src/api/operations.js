/*
 * @Author: zfd
 * @Date: 2020-12-23 10:48:08
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 10:43:42
 * @Description: 操作Api
 */
import request from '@/utils/request'

export const addApi = (data) => {
  return request({
    url: '/Operation',
    method: 'post',
    data
  })
}
export const updateApi = (data) => {
  return request({
    url: '/Operation/update',
    method: 'post',
    data
  })
}
export const listApi = (params) => {
  return request({
    url: '/Operation/get',
    method: 'get',
    params
  })
}
