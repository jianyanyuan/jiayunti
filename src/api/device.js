/*
 * @Author: zfd
 * @Date: 2020-12-23 10:48:08
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-23 10:48:08
 * @Description: 设备Api
 */
import request from '@/utils/request'

export const listApi = () => {
  return request({
    url:"/device",
    method:"get"
  })
}