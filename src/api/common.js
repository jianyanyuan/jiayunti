/*
 * @Author: zfd
 * @Date: 2020-11-10 13:58:25
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-10 15:58:11
 * @Description:
 */
import request from '@/utils/request'

// 获取地址（...区县, ...社区）
const getAddress = () => {
  return request({
    url: '/location',
    method: 'get'
  })
}

// 获取设备选择项
const getDevice = () => {
  return request({
    url: '/location',
    method: 'get'
  })
}

// 获取设计单位选择项
const getDesign = () => {
  return request({
    url: '',
    method: 'get'
  })
}
export default {
  getAddress,
  getDevice,
  getDesign
}
