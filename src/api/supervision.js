/*
 * @Author: zfd
 * @Date: 2020-12-16 16:51:27
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-23 10:49:19
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
const addFault = (data) => {
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