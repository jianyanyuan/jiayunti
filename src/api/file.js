/*
 * @Author: zfd
 * @Date: 2020-10-21 14:32:21
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-21 14:45:29
 * @Description:
 */
import request from '@/utils/request'

const api_prefix_dev = '/file/'

export function upload(data, params) {
  return request({
    url: api_prefix_dev + 'upload',
    method: 'post',
    data,
    params
  })
}

export function remove(params) {
  return request({
    url: api_prefix_dev + 'upload',
    method: 'delete',
    params
  })
}

// 查询意见征询表
export function getConsultation(params) {
  return request({
    url: api_prefix_dev + 'getConsultationFile',
    method: 'get',
    params
  })
}
