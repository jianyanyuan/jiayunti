/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-25 08:47:40
 * @Description: 申请项目仓库
 */
import Project from '@/api/projects'
import { notEmptyArray } from '@/utils'

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
      Project.list().then(res => resolve(res)).catch(err => reject(err))
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

