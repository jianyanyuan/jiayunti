/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-24 09:04:19
 * @Description: 用户仓库
 */
import User from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { notEmptyArray } from '@/utils'
const getDefaultState = () => {
  return {
    token: getToken(),
    id: null,
    username: null,
    address: null,
    phone: null,
    roles: null
  }
}

const state = {
  token: getToken(),
  id: null,
  username: null,
  address: null,
  phone: null,
  roles: null
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
      }).catch((err) => {
        console.log(err)
        reject('登录失败')
      })
    })
  },

  regist(context, data) {
    return new Promise((resolve, reject) => {
      User.regist(data).then(res => {
        resolve('注册成功')
      }).catch(() => {
        reject('注册失败')
      })
    })
  },
  // 找回密码
  findPwd(context, data) {
    return new Promise((resolve, reject) => {
      User.findPwd(data).then(res => {
        resolve('密码修改成功')
      }).catch(() => {
        reject('密码修改失败')
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      User.getUserInfo().then(res => {
        const { id, username, address, roles, phonenumber } = res
        // roles must be a non-empty array
        if (notEmptyArray(roles)) {
          commit('SET_Id', id)
          commit('SET_USER_NAME', username)
          commit('SET_ADDRESS', address)
          commit('SET_ROLES', roles)
          commit('SET_PHONE', phonenumber)
          resolve(res)
        } else {
          reject('用户无权限')
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
      commit('RESET_STATE')
      resetRouter()
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

