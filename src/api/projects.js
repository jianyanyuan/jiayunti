/*
 * @Author: zfd
 * @Date: 2020-11-10 13:58:25
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-03 16:28:53
 * @Description:
 */
import request from '@/utils/request'

const api_prefix_dev = '/project'

// 根据token获取工程列表
const list = (params) => {
  return request({
    url: api_prefix_dev + '/getroleproject',
    method: 'get',
    params
  })
}

const add = (data) => {
  return request({
    url: api_prefix_dev,
    method: 'post',
    data
  })
}

// 获取单个
const detail = id => {
  return request({
    url:api_prefix_dev + '/' + id,
    method: 'get'
  })
}

const update = (id,newprojectRequest) => {
  return request({
    url:api_prefix_dev + '/' + id,
    method: 'put',
    data:newprojectRequest
  })
}
export default {
  list,
  add,
  detail,
  update
}
