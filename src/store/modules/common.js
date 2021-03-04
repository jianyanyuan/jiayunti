
/*
 * @Author: zfd
 * @Date: 2020-09-24 23:00:59
 * @LastEditTime: 2020-12-31 10:40:35
 * @Description: common state
 * @FilePath: \trip-enterprise\src\store\modules\common.js
 */
import Common from '@/api/common'
import Construction from '@/api/construction'
import Supervision from '@/api/supervision'

import { notEmptyArray } from '@/utils'
const state = {
  isOrNo: [
    { key: true, val: '是' },
    { key: false, val: '否' }
  ],
  genderMap: [
    { key: 1, val: '男' },
    { key: 0, val: '女' }
  ],
  normalStatus: [
    { key: 0, val: '正常' },
    { key: 1, val: '禁用' },
    { key: -1, val: '已删除' }
  ],
  actionMap: {
    'enabl': 0,
    'disable': 1,
    'delete': -1
  },
  statusType: [
    { key: 0, val: 'success' },
    { key: 1, val: 'warning' },
    { key: -1, val: 'danger' },
    { key: 3, val: 'info' }
  ],
  buttonSize: [
    { key: 0, val: 'mini' },
    { key: 1, val: 'small' },
    { key: 2, val: 'medium' }
  ],
  handleStatus: [
    { key: 0, val: '未处理' },
    { key: 1, val: '已解决' }
  ],
  handleFault: [
    { key: 0, val: '已整改' },
    { key: 1, val: '未整改' }
  ],
  handleTag: [
    { key: 0, val: 'success' },
    { key: 1, val: 'danger' }
  ],
  auditOptions: [
    { key: 0, val: '通过' },
    { key: 1, val: '不通过' } // 1社区不通过
  ],
  checkOptions: [
    { key: 0, val: '通过' },
    { key: 1, val: '不通过' }
  ],

  // county: 城市--区县
  // community: 街道--社区
  address: [],
  device: [],
  design: [],
  supervision: [],
  construction: [],
  trustees: []
}
const getters = {
  // 城市--区县
  // id,name,areas
  countyOptions: state => state.address?.map(v => {
    return {
      id: v.id,
      name: v.name,
      areas: v.areas?.map(v => {
        return {
          id: v.id,
          name: v.name
        }
      })
    }
  }),

  // 根据城市id--区县id 筛选街道--社区
  // id,name,communities
  communityOptions: (state) => (countySelected) => {
    let communityOptions = []
    if (Array.isArray(countySelected) && countySelected.length === 2) {
      const cityId = countySelected[0]
      const areaId = countySelected[1]
      for (const city of state.address) {
        if (city.id === cityId) {
          for (const area of city.areas) {
            if (area.id === areaId) {
              communityOptions = area.streets
            }
          }
        }
      }
    }

    return communityOptions
  },
  // 设备列表
  deviceOptions: state => state.device?.map(v => {
    if (notEmptyArray(v.deviceTypes)) {
      return {
        value: v.id,
        label: v.devicename,
        children: v.deviceTypes.map(v => {
          return {
            value: v.id,
            label: v.type
          }
        })
      }
    } else {
      return {
        value: v.id,
        label: v.devicename
      }
    }
  }),
  // 设计院列表
  designOptions: state => state.design?.map(v => {
    return {
      value: v.id,
      label: v.designname
    }
  }),
  // 监理单位列表
  supervisionOptions: state => state.supervision?.map(v => {
    return {
      value: v.id,
      label: v.supervisionName
    }
  }),
  // 施工单位列表
  constructionOptions: state => state.construction?.map(v => {
    return {
      value: v.id,
      label: v.constructionName
    }
  }),
  // 委托人列表
  trusteeOptions: state => state.trustees?.map(v => {
    return {
      value: v.id,
      label: v.name
    }
  })
}

const mutations = {
  SET_ADDRESS: (state, address) => {
    state.address = address
  },
  SET_DEVICE: (state, device) => {
    state.device = device
  },
  SET_DESIGN: (state, design) => {
    state.design = design
  },
  SET_CONSTRUCTION: (state, construction) => {
    state.construction = construction
  },
  SET_SUPERVISION: (state, supervision) => {
    state.supervision = supervision
  },
  SET_TRUESTEES: (state, trustees) => {
    state.trustees = trustees
  }
}
const actions = {
  // get address
  getAddress({ commit }) {
    return new Promise((resolve, reject) => {
      Common.getAddress().then(res => {
        if (res.content) {
          commit('SET_ADDRESS', res.content)
          resolve(res.content)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  // get device
  getDevice({ commit }) {
    return new Promise((resolve, reject) => {
      Common.getDevice({}, {}).then(res => {
        if (res.content) {
          commit('SET_DEVICE', res.content)
          resolve(res.content)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  // get design
  getDesign({ commit }) {
    return new Promise((resolve, reject) => {
      Common.getDesign({}, {}).then(res => {
        if (res.content) {
          commit('SET_DESIGN', res.content)
          resolve(res.content)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  // get construction
  getConstruction({ commit }) {
    return new Promise((resolve, reject) => {
      Construction.list({ }, {}).then((res) => {
        if (res.content) {
          commit('SET_CONSTRUCTION', res.content)
          resolve(res.content)
        } else {
          reject(res)
        }
      })
        .catch(err => {
          reject(err)
        })
    })
  },
  // get Supervision
  getSupervision({ commit }) {
    return new Promise((resolve, reject) => {
      Supervision.list({ }, {}).then((res) => {
        if (res.content) {
          commit('SET_SUPERVISION', res.content)
          resolve(res.content)
        } else {
          reject(res)
        }
      })
        .catch(err => {
          reject(err)
        })
    })
  },
  getTrustee({ commit }) {
    return new Promise((resolve, reject) => {
      Common.getTrustee({}, {}).then((res) => {
        if (res.content) {
          commit('SET_TRUESTEES', res.content)
          resolve(res.content)
        } else {
          reject(res)
        }
      })
        .catch(err => {
          reject(err)
        })
    })
  }

}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
