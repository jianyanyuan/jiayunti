/*
 * @Author: zfd
 * @Date: 2020-12-14 10:11:19
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-23 09:01:10
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
    data:responseRequest
  })
}

// 获取施工单位信息
const getInfo = (projectId) => {
  return request({
    url:`/construction/${projectId}`,
    method:'get'
  })
}
export default {
  addOffer,
  listOffers,
  detailOffer,
  reform,
  getInfo
}