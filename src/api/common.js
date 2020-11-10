import request from '@/utils/request'

// 获取地址（...区县, ...社区）
const getAddress = () => {
  return request({
    url: '/location',
    method: 'get'
  })
}

export default {
  getAddress
}
