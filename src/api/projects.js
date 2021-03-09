/*
 * @Author: zfd
 * @Date: 2020-11-10 13:58:25
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-22 09:09:56
 * @Description:
 */
import request from '@/utils/request'

const api_prefix_dev = '/project'

// 根据token获取工程列表
export const listApi = (params, data) => {
  return request({
    url: api_prefix_dev + '/getroleproject',
    method: 'post',
    params,
    data
  })
}

// 新增申请
export const addApi = (data) => {
  return request({
    url: api_prefix_dev,
    method: 'post',
    data
  })
}

// 撤销申请
export const cancelApi = (id) => {
  return request({
    url: `/flowchartlogic/${id}`,
    method: 'get'
  })
}

// 获取单个
export const detailApi = id => {
  return request({
    url: api_prefix_dev + '/' + id,
    method: 'get'
  })
}

// 修改申请基本资料
export const updateApi = (id, newprojectRequest) => {
  return request({
    url: api_prefix_dev + '/' + id,
    // headers: { 'Content-Type': 'application/json' } ,
    method: 'put',
    data: newprojectRequest
  })
}

// 流程步骤更新
export const advanceApi = (projectId, status, constructionId, supervisionId) => {
  return request({
    url: '/flowchartlogic',
    // headers: { 'Content-Type': 'application/json' } ,
    method: 'post',
    data: {
      projectId,
      status,
      constructionId,
      supervisionId
    }
  })
}

// 审核
export const checkApi = (communityReviewRequest) => {
  return request({
    url: '/CommunityReview',
    method: 'post',
    data: communityReviewRequest
  })
}

// 查看工程选择的设计院信息
export const getDesignerApi = (projectId) => {
  return request({
    url: `/design/${projectId}`,
    method: 'get'
  })
}

// 新增补贴
export const addBonusApi = (projectId, data) => {
  return request({
    url: `/Bonus/${projectId}`,
    method: 'post',
    data
  })
}

// 补贴查看
export const getBonusApi = (projectId) => {
  return request({
    url: `/Bonus/${projectId}`,
    method: 'get'
  })
}

// 获取增梯办信息
export const getInsInfoApi = (projectId) => {
  return request({
    url: `/users/${projectId}`,
    method: 'get'
  })
}

export const getApplyStatusApi = () => {
  return request({
    url: `/Flow`,
    method: 'get'
  })
}
