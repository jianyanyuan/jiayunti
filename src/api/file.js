/*
 * @Author: zfd
 * @Date: 2020-10-21 14:32:21
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-24 17:33:31
 * @Description:
 */
import request from '@/utils/request'

const api_prefix_dev = '/file/'

// 其他附件上传
const upload = (data, params) => {
  return request({
    url: api_prefix_dev + 'upload',
    method: 'post',
    data,
    params
  })
}

// 删除文件
const remove = (id) => {
  return request({
    url: api_prefix_dev + 'deleteFile/' + id,
    method: 'delete'
  })
}

// 意见征询表上传
const uploadOpinion = (data, params) => {
  return request({
    url: api_prefix_dev + 'uploadOpinion',
    method: 'post',
    data,
    params
  })
}

// 删除意见征询表
const  removeOpinion =  (id) => {
  return request({
    url: api_prefix_dev + 'deleteOpinionFile/' + id,
    method: 'delete',
  })
}

// 查询意见征询表
const getConsultation =  (params) => {
  return request({
    url: api_prefix_dev + 'getConsultationFile',
    method: 'get',
    params
  })
}

// 查询文件
const get =  (params) => {
  return request({
    url: api_prefix_dev + 'getFile',
    method: 'get',
    params
  })
}

// 报价材料上传
const uploadOffer = (ConstructionPriceId, data ) => {
  return request({
    url: api_prefix_dev + 'uploadPriceFile?ConstructionPriceId='+ ConstructionPriceId ,
    method: 'post',
    data
  })
}

// 现场照片获取
const getLocalFile = (projectId) => {
  return request({
    url: `${api_prefix_dev}getLocalFile?projectId=${projectId}&typeName=locale-form`,
    method: 'get'
  })
}
// 违规文件上传
/**
 * 
 * @param {*} data 
 * @param {*} IllegalBehaviorId 
 * @param {*} type 
 * illegal 违规附件
 * rectification 整改附件
 */
const uploadFault = (data, IllegalBehaviorId, type) => {
  return request({
    url: `${api_prefix_dev}/uploadIllegalFile`,
    method: 'post',
    data,
    params:
    {
      IllegalBehaviorId,
      type
    }
  })
}
// 上传
// const uploadInfoFile = (data ) => {
//   return request({
//     url: api_prefix_dev + 'uploadImage',
//     method: 'post',
//     data
//   })
// }
export default {
  upload,
  remove,
  uploadOpinion,
  removeOpinion,
  getConsultation,
  get,
  uploadOffer,
  uploadFault,
  getLocalFile
}
