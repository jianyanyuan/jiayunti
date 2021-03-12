/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 12:00:02
 * @Description: 申请项目仓库
 */
import { listApi } from '@/api/projects'
import { getApplyStatusApi } from '@/api/operations'
const state = {
  // 当前申请是否为委托
  isDelegated: false,
  // 申请节点
  applyStatus: [],
  applyTag: [
    { key: 0, val: 'warning' },
    { key: 1, val: 'warning' },
    { key: 2, val: 'primary' },
    { key: 3, val: 'primary' },
    { key: 4, val: 'primary' },
    { key: 4, val: 'warning' },
    { key: 5, val: 'primary' },
    { key: 6, val: 'warning' },
    { key: 7, val: 'warning' },
    { key: 8, val: 'warning' },
    { key: 9, val: 'warning' },
    { key: 10, val: 'warning' },
    { key: 11, val: 'info' },
    { key: 12, val: 'success' },
    { key: 13, val: 'warning' },
    { key: 14, val: 'info' }
  ],
  roles: [
    { key: 0, val: 'ROLE_COMMUNITY' },
    { key: 1, val: 'ROLE_DESIGNER' },
    { key: 2, val: 'ROLE_DEVICE' },
    { key: 3, val: 'ROLE_DRAWING_AUDIT' },
    { key: 4, val: 'ROLE_INCREASE_LIFT' },
    { key: 4, val: 'ROLE_RESIDENT' },
    { key: 5, val: 'ROLE_PRINCIPAL' },
    { key: 6, val: 'ROLE_STREET' },
    { key: 7, val: 'ROLE_CAPITAL_RULE' },
    { key: 8, val: 'ROLE_HOUSE_CONSTRUCTION' },
    { key: 9, val: 'ROLE_URBAN_MANAGEMENT' },
    { key: 10, val: 'ROLE_MARKET_SUPERVISOR' },
    { key: 11, val: 'ROLE_CONSTRUCTION' },
    { key: 12, val: 'ROLE_SUPERVISION' },
    { key: 13, val: 'ROLE_ADMIN' }
  ],
  // 项目操作
  operations: {}
}

const getters = {
  validApplyStatus: (state) => {
    return state.applyStatus.filter(v => v.isValid)
  }
}
const mutations = {
  SET_APPLY_STATUS: (state, applyStatus) => {
    state.applyStatus = applyStatus
  }
}

const actions = {
  // get projects
  list() {
    return new Promise((resolve, reject) => {
      listApi().then(res => resolve(res)).catch(err => reject(err))
    })
  },
  getApplyStatus({ commit }, district) {
    return new Promise((resolve, reject) => {
      getApplyStatusApi(district)
        .then(applyStatus => {
          applyStatus = applyStatus.map(v => ({ key: v.status, val: v.name, isValid: v.isValid, district: v.district, isStart: v.isStart, id: v.id }))
          applyStatus.unshift({ key: null, val: '空', isValid: true })
          commit('SET_APPLY_STATUS', applyStatus)
          resolve(applyStatus)
        })
        .catch(errMsg => reject(errMsg))
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

