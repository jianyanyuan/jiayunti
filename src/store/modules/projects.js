/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-13 11:03:07
 * @Description: 申请项目仓库
 */
import Project from '@/api/projects'
import { checkEmptyArray } from '@/utils'
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
  // user login
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     User.login({ username: username.trim(), password: password }).then(res => {
  //       const token = `${res.tokenType} ${res.accessToken}`
  //       commit('SET_TOKEN', token)
  //       setToken(token)
  //       resolve('登录成功')
  //     }).catch(() => {
  //       reject('登录失败')
  //     })
  //   })
  // }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

