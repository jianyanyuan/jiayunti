/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-11 11:25:52
 * @Description: 用户仓库
 */
import User from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { checkEmptyArray } from '@/utils'
const getDefaultState = () => {
  return {
    id: '',
    username: '',
    token: '',
    // name: '',
    // avatar: '',
    // introduction: '',
    roles: []
  }
}

const state = {
  token: getToken(),
  id: '',
  username: '',
  // name: '',
  // avatar: '',
  // introduction: '',
  roles: []
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_Id: (state, id) => {
    state.id = id
  },
  SET_USER_NAME: (state, username) => {
    state.username = username
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_ADDRESS: (state, address) => {
    state.address = address
  },
  // SET_INTRODUCTION: (state, introduction) => {
  //   state.introduction = introduction
  // },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      User.login({ username: username.trim(), password: password }).then(res => {
        const token = `${res.tokenType} ${res.accessToken}`
        commit('SET_TOKEN', token)
        setToken(token)
        resolve('登录成功')
        // commit('SET_Id', res.id)
        // commit('SET_USER_NAME', res.username)

        // if (Array.isArray(res.roles) && res.roles.length > 0) {
        //   commit('SET_ROLES', res.roles)
        // } else {
        //   reject('error')
        //   return false
        // }
      }).catch(() => {
        reject('登录失败')
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      User.getUserInfo().then(res => {
        const { id, username, address, roles, phonenumber } = res
        // roles must be a non-empty array
        if (checkEmptyArray(roles)) {
          reject('用户无权限')
        } else {
          commit('SET_Id', id)
          commit('SET_USER_NAME', username)
          commit('SET_ADDRESS', address)
          commit('SET_ROLES', roles)
          commit('SET_PHONE', phonenumber)
          resolve(res)
        }
      }).catch(() => {
        reject('用户信息获取失败')
      })
    })
  },

  // get verificationCode
  getCode(context, params) {
    return new Promise((resolve, reject) => {
      User.getCode(params).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      // removeRoleToken()
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

