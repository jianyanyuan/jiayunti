/*
 * @Author: zfd
 * @Date: 2020-12-16 16:51:27
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-16 16:51:27
 * @Description: 监理单位接口
 */
import request from '@/utils/request'

// 监理单位列表
const list = () => {
  return request({
    url:"/Supervision",
    method: 'get'
    })
}



export default {
  list
}