/*
 * @Author: zfd
 * @Date: 2020-11-10 13:58:25
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-25 14:52:20
 * @Description:
 */
import request from '@/utils/request'

const api_prefix_dev = '/project'

// 根据token获取工程列表
const list = () => {
  return request({
    url: api_prefix_dev + '/getroleproject',
    method: 'get'
  })
}

const add = (data) => {
  return request({
    url: api_prefix_dev,
    method: 'post',
    data
  })
}

export default {
  list,
  add
}
