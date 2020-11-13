/*
 * @Author: zfd
 * @Date: 2020-11-10 13:58:25
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-13 11:00:21
 * @Description:
 */
import request from '@/utils/request'

const api_prefix_dev = '/project'

const list = () => {
  return request({
    url: api_prefix_dev,
    method: 'get'
  })
}

const add = () => {
  return request({
    url: api_prefix_dev,
    method: 'post'
  })
}

export default {
  list,
  add
}
