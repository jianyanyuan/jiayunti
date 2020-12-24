/*
 * @Author: zfd
 * @Date: 2020-12-11 15:19:54
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-24 14:31:29
 * @Description: 设计院接口
 */
import request from '@/utils/request'


// 获取档案
const getArchives = (id) => {
  return request({
    url: '/designInstituteArchives/DesignInstituteArchives/' + id,
    method: 'get'
  })
}

// 修改档案
const modifyArchives = (designInstituteArchivesRequest ) => {
  return request({
    url: '/designInstituteArchives/updateDesignInstituteArchives',
    method: 'put',
    data:designInstituteArchivesRequest
  })
}
 
// 获取设计信息
const getInfo = (projectId) => {
  return request({
    url:`/design/${projectId}`,
    method:'get'
  })
}

const list = ()=> {
  return request({
    url:'/design',
    method:'get'
  })
}
export default {
  getArchives,
  modifyArchives,
  getInfo,
  list
}