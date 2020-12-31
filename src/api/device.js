/*
 * @Author: zfd
 * @Date: 2020-12-23 10:48:08
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 10:43:42
 * @Description: 设备Api
 */
import request from '@/utils/request'

export const listApi = (params, data) => {
  return request({
    url: '/device/getAll',
    method: 'post',
    params,
    data
  })
}
