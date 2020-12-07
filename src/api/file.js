/*
 * @Author: zfd
 * @Date: 2020-10-21 14:32:21
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-07 16:10:07
 * @Description:
 */
import request from '@/utils/request'

const api_prefix_dev = '/file/'

// 其他附件上传
export function upload(data, params) {
  return request({
    url: api_prefix_dev + 'upload',
    method: 'post',
    data,
    params
  })
}

// 删除文件
export function remove(id) {
  return request({
    url: api_prefix_dev + 'deleteFile/' + id,
    method: 'delete'
  })
}

// 意见征询表上传
export function uploadOpinion(data, params) {
  return request({
    url: api_prefix_dev + 'uploadOpinion',
    method: 'post',
    data,
    params
  })
}

// 删除意见征询表
export function removeOpinion(id) {
  return request({
    url: api_prefix_dev + 'deleteOpinionFile/' + id,
    method: 'delete',
  })
}

// 查询意见征询表
export function getConsultation(params) {
  return request({
    url: api_prefix_dev + 'getConsultationFile',
    method: 'get',
    params
  })
}

// 查询文件
export function get(params) {
  return request({
    url: api_prefix_dev + 'getFile',
    method: 'get',
    params
  })
}
