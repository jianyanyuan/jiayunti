/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 12:03:03
 * @Description:
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './action'
Vue.use(Vuex)

const modulesFiles = require.context('./modules', true, /\.js$/)

// 导入模块
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
  actions
})

export default store
