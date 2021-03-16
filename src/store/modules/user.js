/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-16 11:13:13
 * @Description: 用户仓库
 */
import User from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { notEmptyArray } from '@/utils'
import { listApi } from '@/api/operations'

const getDefaultState = () => {
  return {
    token: getToken(),
    id: null,
    username: null,
    address: null,
    phone: null,
    roles: null,
    operations: {}

  }
}

const state = {
  token: getToken(),
  id: null,
  username: null,
  address: null,
  phone: null,
  roles: null,
  operations: {}
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
  },
  SET_OPERATIONS: (state, operations) => {
    state.operations = operations
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      User.login({ username: username.trim(), password: password }).then(token => {
        commit('SET_TOKEN', token)
        setToken(token)
        resolve('登录成功')
      }).catch((errorMsg) => {
        reject(errorMsg)
      })
    })
  },

  regist(context, data) {
    return new Promise((resolve, reject) => {
      User.regist(data).then(res => {
        resolve('注册成功')
      }).catch((err) => {
        reject(err.response.data.message || '注册失败')
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
  // 修改密码
  modifyPwd(context, data) {
    return new Promise((resolve, reject) => {
      User.modifyPwd(data).then(res => {
        res.code === 400 ? reject('原密码错误') : resolve('密码修改成功')
      }).catch(() => {
        reject('原密码错误')
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      User.getUserInfo().then(userInfo => {
        // 返回的address是字符串数组
        const { id, username, address, roles, phonenumber } = userInfo
        // roles must be a non-empty array
        if (notEmptyArray(roles)) {
          commit('SET_Id', id)
          commit('SET_USER_NAME', username)
          commit('SET_ADDRESS', address)
          commit('SET_ROLES', roles)
          commit('SET_PHONE', phonenumber)
          resolve(userInfo)
        } else {
          removeToken() // must remove  token  first
          // removeRoleToken()
          commit('RESET_STATE')
          resetRouter()
          reject('用户无权限')
        }
      }).catch((errMsg) => {
        reject(errMsg)
      })
    })
  },

  // 获取用户操作
  getOperation({ commit }, { district, role, setState = false }) {
    return new Promise((resolve, reject) => {
      if (role) {
        listApi({ district, role })
          .then(operations => {
            const result = {}
            if (notEmptyArray(operations)) {
              for (const o of operations) {
                // 用户需过滤掉禁用的操作
                if (setState && !o.isValid) continue
                if (Array.isArray(result[o.status])) {
                  result[o.status].push(o)
                } else {
                  result[o.status] = [o]
                }
              }
            }
            setState && commit('SET_OPERATIONS', result)

            resolve(result)
          })
          .catch(errMsg => {
            reject(errMsg)
          })
      } else {
        setState && commit('SET_OPERATIONS', {})

        resolve({})
      }
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

