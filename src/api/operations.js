/*
 * @Author: zfd
 * @Date: 2020-12-23 10:48:08
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 10:43:42
 * @Description: 操作Api
 */
import request from '@/utils/request'

// 操作配置
export const addApi = (data) => {
  return request({
    url: '/Operation',
    method: 'post',
    data
  })
}
// 操作配置
export const updateApi = (data) => {
  return request({
    url: '/Operation/update',
    method: 'post',
    data
  })
}
// 操作配置
export const listApi = (params) => {
  return request({
    url: '/Operation/get',
    method: 'get',
    params
  })
}

// 获取工程状态节点,包含被禁用的
export const getApplyStatusApi = (district) => {
  return request({
    url: `/Flow/all?district=${district}`,
    method: 'get'
  })
}

// 节点配置
export const addNodeApi = (data) => {
  return request({
    url: '/Flow/add',
    method: 'post',
    data
  })
}
// 节点配置
export const updateNodeApi = (id, data) => {
  return request({
    url: '/Flow/update/' + id,
    method: 'post',
    data
  })
}
// 管理员审核列表
export const companyAduitApi = (params, data) => {
  return request({
    url: '/Company/admin',
    method: 'post',
    params,
    data
  })
}
// 管理员审核详情
export const companyDetailApi = (userId) => {
  return request({
    url: '/Company/admin/' + userId,
    method: 'get'
  })
}
