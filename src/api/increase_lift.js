/*
 * @Author: zfd
 * @Date: 2020-12-14 10:11:19
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-14 14:42:11
 * @Description: 增梯办
 */
import request from '@/utils/request'

// 管道踏勘
const listPipe = (projectId) => {
  return request({
    url: `/pipelineexploration/${projectId}/All`,
    method: 'get'
  })
}
// 删除单个踏勘项目
const deletePipeItem = (pipeItemId) => {
  return request({
    url: `/pipelineexploration/${pipeItemId}`,
    method: 'delete'
  })
}
// 修改单个踏勘项目
const modifyPipe = (newPipelineExploration) => {
  return request({
    url: '/pipelineexploration/update',
    method: 'put',
    data: newPipelineExploration
  })
}
// 新增踏勘项目
const addPipeItems = (projectId, pipeItems) => {
  return request({
    url: '/pipelineexploration/add/' + projectId,
    method: 'post',
    data: pipeItems
  })
}
export default {
  listPipe,
  modifyPipe,
  deletePipeItem,
  addPipeItems
}
