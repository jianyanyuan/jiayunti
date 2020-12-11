/*
 * @Author: zfd
 * @Date: 2020-12-11 15:19:54
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-11 16:21:50
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
    url: '/designInstituteArchives/DesignInstituteArchives',
    method: 'put',
    data:designInstituteArchivesRequest
  })
}

export default {
  getArchives,
  modifyArchives
}