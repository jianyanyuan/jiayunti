/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-21 17:31:07
 * @Description: 申请项目仓库
 */
import {listApi} from '@/api/projects'

const getDefaultState = () => {
  return {
    // token: getToken(),
    // id: null,
    // username: null,
    // address: null,
    // phone: null,
    // roles: null
  }
}

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

