/*
 * @Author: zfd
 * @Date: 2020-12-14 10:11:19
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-14 14:42:11
 * @Description: 增梯办
 */
import request from '@/utils/request'

// 管道踏勘
const listPipe = (projectId ) => {
  return request({
    url:`/pipelineexploration/${projectId}/All`,
    method: 'get',
  })
}

const modifyPipe = (newPipelineExploration ) => {
  return request({
    url: '/pipelineexploration/update',
    method: 'put',
    data:newPipelineExploration  
  })
}


export default {
  listPipe,
  modifyPipe
}