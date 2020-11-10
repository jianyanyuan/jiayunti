
/*
 * @Author: zfd
 * @Date: 2020-09-24 23:00:59
 * @LastEditTime: 2020-11-10 15:43:46
 * @Description: common state
 * @FilePath: \trip-enterprise\src\store\modules\common.js
 */
import Common from '@/api/common'

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
  handleStatus: [
    { key: 0, val: '未处理' },
    { key: 1, val: '已解决' }
  ],
  handleTag: [
    { key: 0, val: 'danger' },
    { key: 1, val: 'success' }
  ],
  applyStatus: [
    { key: 0, val: '申请中' },
    { key: 1, val: '社区受理' },
    { key: 2, val: '方案设计' },
    { key: 3, val: '公示阶段' },
    { key: 4, val: '管道踏勘' },
    { key: 5, val: '施工图设计' },
    { key: 6, val: '施工图审核' },
    { key: 7, val: '施工报价' },
    { key: 8, val: '街道审核' },
    { key: 9, val: '联合审查' },
    { key: 10, val: '审核通过' },
    { key: 11, val: '施工中' },
    { key: 12, val: '竣工验收' },
    { key: 13, val: '驳回' },
    { key: 14, val: '已撤销' }
  ],
  applyTag: [
    { key: 0, val: 'warning' },
    { key: 1, val: 'warning' },
    { key: 2, val: 'primary' },
    { key: 3, val: 'primary' },
    { key: 4, val: 'warning' },
    { key: 5, val: 'primary' },
    { key: 6, val: 'warning' },
    { key: 7, val: 'warning' },
    { key: 8, val: 'warning' },
    { key: 9, val: 'warning' },
    { key: 10, val: 'success' },
    { key: 11, val: 'info' },
    { key: 12, val: 'info' },
    { key: 13, val: 'warning' },
    { key: 14, val: 'warning' }

  ],

  // county: 城市--区县
  // community: 街道--社区
  address: null
}
const getters = {
  // 城市--区县
  // id,name,areas
  countyOptions: state => state.address.map(v => {
    return {
      id: v.id,
      name: v.name,
      areas: v.areas.map(v => {
        return {
          value: v.id,
          label: v.name
        }
      })
    }
  }),

  // 根据城市id--区县id 筛选街道--社区
  // id,name,communities
  communityOptions: (state) => (countySelected) => {
    const communityOptions = []
    if (Array.isArray(countySelected) && countySelected.length === 2) {
      const cityId = countySelected[0]
      const areaId = countySelected[1]
      for (const city of state.address) {
        if (city.id === cityId) {
          for (const area of city.areas) {
            if (area.id === areaId) {
              communityOptions.push(area.streets)
            }
          }
        }
      }
    }

    return communityOptions
  }
}

const mutations = {
  SET_ADDRESS: (state, address) => {
    state.address = address
  }
}
const actions = {
  // get address
  getAddress({ commit }) {
    return new Promise((resolve, reject) => {
      Common.getAddress().then(res => {
        commit('SET_ADDRESS', res)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // get device
  getDevice({ commit }) {

  },
  // get design
  getDesign({ commit }) {

  }

}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
