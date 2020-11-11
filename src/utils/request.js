/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-11 13:26:56
 * @Description:
 */
import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
  // headers: {
  //   post: {
  //     'Content-Type': 'application/json;charset=UTF-8'
  //   }
  // },
  // emulateJSON: true,
  // withCredentials: true // Check cross-site Access-Control
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['Authorize'] = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjAzMjYwODk4LCJleHAiOjE2MDMyNjQ0OTh9.84WJfDqCJhhcaiD66XGBvhQyoPfiO7A_U7Y1r9AGpVxJdxF9IywDVUimj9jLhC3kRHqGkrHNrRPobfd1GgaUEA'
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    // 2开头的请求成功，返回响应体
    if (String(response.status).startsWith('2')) {
      return response.data
    } else {
      // 其他提示请求错误
      // Message({
      //   message: response.statusText || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      return Promise.reject(response)
    }
  },
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
