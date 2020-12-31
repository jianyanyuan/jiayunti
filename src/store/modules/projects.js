/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 12:00:02
 * @Description: 申请项目仓库
 */
import { listApi } from '@/api/projects'

const state = {

}

const mutations = {

}

const actions = {
  // get projects
  list() {
    return new Promise((resolve, reject) => {
      listApi().then(res => resolve(res)).catch(err => reject(err))
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

