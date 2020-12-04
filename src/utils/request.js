/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-04 08:42:25
 * @Description:
 */
import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 5000, // request timeout
  retry: 3, // 设置全局请求次数
  retryDelay: 1000, // 设置全局请求间隙
  // headers: {'Content-Type': 'application/json;charset=UTF-8'}

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
      // config.headers['Content-Type'] = 'application/json;charset=UTF-8'
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
    // 对响应错误做点什么
    // if(error.message.includes('timeout')){   // 判断请求异常信息中是否含有超时timeout字符串
    //   console.log("错误回调", error);
    //   alert("网络超时");
    // }

    // 超时处理
    // #region
    // var config = error.config
    // if (!config || !config.retry) return Promise.reject(error)
    // // 设置用于跟踪重试次数的变量
    // config.__retryCount = config.__retryCount || 0

    // // 检查我们是否已将重试总数最大化
    // if (config.__retryCount >= config.retry) {
    //   // 错误拒绝
    //   return Promise.reject(error)
    // }

    // // 增加重试次数
    // config.__retryCount += 1

    // // 创造新的承诺来处理指数退避
    // var backoff = new Promise(function(resolve) {
    //   setTimeout(function() {
    //     resolve()
    //   }, config.retryDelay || 1)
    // })

    // // 返回承诺，其中将撤回axios以重试请求
    // return backoff.then(function() {
    //   return axios(config)
    // })
    // #endregion
    return Promise.reject(error)
  }
)

export default service
