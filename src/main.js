/*
 * @Author: zfd
 * @Date: 2020-10-09 19:47:59
 * @LastEditTime: 2020-11-20 15:23:39
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

import UploadList from '@/components/UploadList'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui modal-drag



// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(elDragDialog) // 注册插件

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.component('UploadList', UploadList)

const isDebug_mode = process.env.NODE_ENV !== 'production'
Vue.config.debug = isDebug_mode
Vue.config.devtools = isDebug_mode
Vue.config.productionTip = isDebug_mode

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
