/*
 * @Author: zfd
 * @Date: 2020-12-14 10:11:19
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 10:43:58
 * @Description: 施工单位
 */
import request from '@/utils/request'

// 报价
const addOffer = (projectId, data) => {
  return request({
    url: `/constructionPrice/${projectId}`,
    method: 'post',
    data
  })
}

// 获取项目报价
const listOffers = (projectId, params) => {
  return request({
    url: `/constructionPrice/getAll/${projectId}`,
    method: 'get',
    params
  })
}

// 根据项目获取报价
const getProOffer = (projectId) => {
  return request({
    url: `/constructionPrice/getOneHistory/${projectId}`,
    method: 'get'
  })
}

// 获取单个报价表
const detailOffer = (id) => {
  return request({
    url: `/constructionPrice/getOne/${id}`,
    method: 'get'
  })
}

// 违规整改
const reform = (responseRequest) => {
  return request({
    url: `/IllegalBehavior`,
    method: 'put',
    data: responseRequest
  })
}

// 获取施工单位信息
const getInfo = (projectId) => {
  return request({
    url: `/construction/${projectId}`,
    method: 'get'
  })
}

// 获取所有施工单位
const list = (params, data) => {
  return request({
    url: `/construction`,
    method: 'post',
    params,
    data
  })
}

// 违规是否全部整改完
const isResolved = (projectId) => {
  return request({
    url: `/IllegalBehavior/isResolved/${projectId}`,
    method: 'get'
  })
}
export default {
  addOffer,
  listOffers,
  detailOffer,
  reform,
  getInfo,
  list,
  getProOffer,
  isResolved
}
