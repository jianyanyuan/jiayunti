/*
 * @Author: zfd
 * @Date: 2020-11-10 13:58:25
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 10:44:05
 * @Description:
 */
import request from '@/utils/request'

// 获取地址（...区县, ...社区）
const getAddress = () => {
  return request({
    url: '/location',
    method: 'get'
  })
}

// 获取设备选择项
const getDevice = (params, data) => {
  return request({
    url: '/device/getAll',
    method: 'post',
    params,
    data
  })
}

// 获取设计单位选择项
const getDesign = (params, data) => {
  return request({
    url: '/design/getAll',
    method: 'post',
    params,
    data
  })
}

// 单位信息api
const getArticle = () => {
  return request({
    url: '/Company',
    method: 'get'
  })
}

const modifyArticle = (newCompany) => {
  return request({
    url: '/Company',
    method: 'put',
    data: newCompany
  })
}

const addArticle = (data) => {
  return request({
    url: '/Company',
    method: 'post',
    data
  })
}
const getArticleById = (id) => {
  return request({
    url: '/Company/' + id,
    method: 'get'
  })
}
export default {
  getAddress,
  getDevice,
  getDesign,
  getArticle,
  modifyArticle,
  addArticle,
  getArticleById
}
