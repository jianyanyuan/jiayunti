/*
 * @Author: zfd
 * @Date: 2020-10-09 19:47:59
 * @LastEditTime: 2021-01-04 14:15:13
 * @Description: main.js
 * @FilePath: \vue-admin-template\src\main.js
 */
import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/theme/index.css' // custom element ui theme
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as filters from '@/filters' // global filters

import UploadList from 'element-ui/packages/upload/src/upload-list'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/display.css'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.component('UploadList', UploadList)
// Vue.config.productionTip = false
const isDebug_mode = process.env.NODE_ENV !== 'production'
Vue.config.debug = isDebug_mode
Vue.config.devtools = isDebug_mode
Vue.config.productionTip = isDebug_mode
Vue.prototype.$echarts = echarts
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
