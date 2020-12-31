/*
 * @Author: zfd
 * @Date: 2020-12-11 15:19:54
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 10:43:50
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
const modifyArchives = (designInstituteArchivesRequest) => {
  return request({
    url: '/designInstituteArchives/updateDesignInstituteArchives',
    method: 'put',
    data: designInstituteArchivesRequest
  })
}

// 获取设计信息
const getInfo = (projectId) => {
  return request({
    url: `/design/${projectId}`,
    method: 'get'
  })
}

const list = (params, data) => {
  return request({
    url: '/design/getAll',
    method: 'post',
    params,
    data
  })
}
export default {
  getArchives,
  modifyArchives,
  getInfo,
  list
}
