/*
 * @Author: zfd
 * @Date: 2020-12-14 10:11:19
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 15:51:55
 * @Description:
 */
import request from '@/utils/request'

// 查看审核历史记录
const checkSingle = (projectId) => {
  return request({
    url: '/CommunityReview/' + projectId,
    method: 'get'
  })
}

// 查看最新的审核记录
const checkLatest = (projectId) => {
  return request({
    url: '/CommunityReview/opinion/' + projectId,
    method: 'get'
  })
}

// 审核历史记录 / 报价历史记录
const auditHistorylist = (params, data) => {
  return request({
    url: '/project/getHistoryAccording/history',
    method: 'post',
    params,
    data
  })
}
// 异议处理
const listObjection = (applyId) => {
  return request({
    url: '/Objection/' + applyId,
    method: 'get'
  })
}
const modifyObjection = (objections) => {
  return request({
    url: '/Objection',
    method: 'put',
    data: objections
  })
}

const addObjection = (projectId, data) => {
  return request({
    url: '/Objection/' + projectId,
    method: 'post',
    data
  })
}

const removeObjection = (id) => {
  return request({
    url: '/Objection/' + id,
    method: 'delete'
  })
}
export default {
  auditHistorylist,
  checkSingle,
  listObjection,
  modifyObjection,
  addObjection,
  removeObjection,
  checkLatest
}