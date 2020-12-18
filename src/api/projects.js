/*
 * @Author: zfd
 * @Date: 2020-11-10 13:58:25
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-04 08:36:28
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

// 新增申请
const add = (data) => {
  return request({
    url: api_prefix_dev,
    method: 'post',
    data
  })
}

// 撤销申请
const cancel = (id) => {
  return request({
    url: `/flowchartlogic/${id}`,
    method: 'get'
  })
}

// 获取单个
const detail = id => {
  return request({
    url:api_prefix_dev + '/' + id,
    method: 'get'
  })
}

// 修改申请基本资料
const update = (id,newprojectRequest) => {
  return request({
    url:api_prefix_dev + '/' + id,
    // headers: { 'Content-Type': 'application/json' } ,
    method: 'put',
    data:newprojectRequest
  })
}

// 流程步骤更新
const advance = (projectId,status,constructionId,supervisionId) => {
  return request({
    url:'/flowchartlogic',
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
const check = (communityReviewRequest ) => {
  return request({
    url:'/CommunityReview',
    method: 'post',
    data:communityReviewRequest
  })
}

// 查看工程选择的设计院信息

const getDesigner = (projectId ) => {
  return request({
    url:`/design/${projectId}`,
    method: 'get'
  })
}
export default {
  list,
  add,
  detail,
  update,
  advance,
  check,
  getDesigner,
  cancel
}
