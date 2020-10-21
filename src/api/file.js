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
