/*
 * @Author: zfd
 * @Date: 2020-12-16 16:51:27
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-18 16:43:54
 * @Description: 监理单位接口
 */
import request from '@/utils/request'

// 监理单位列表
const list = () => {
  return request({
    url: "/Supervision",
    method: 'get'
  })
}

// 违规记录
const addFault = (illegalBehaviorRequest) => {
  return request({
    url: '/IllegalBehavior',
    method: 'post',
    data
  })
}

// 违规回复
const faultReply = (toResponseRequest) => {
  return request({
    url: '/IllegalBehavior/ToResponse',
    method: 'put',
    data: toResponseRequest
  })
}

// 违规获取
const getFault = (projectId ) => {
  return request({
    url: `/IllegalBehavior/${projectId}`,
    method: 'get'
  })
}
export default {
  list,
  addFault,
  faultReply,
  getFault
}