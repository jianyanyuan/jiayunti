
/*
 * @Author: zfd
 * @Date: 2020-09-24 23:00:59
 * @LastEditTime: 2020-11-03 14:48:31
 * @Description: common state
 * @FilePath: \trip-enterprise\src\store\modules\common.js
 */
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
  // 省份--城市--区县
  addressOptions: [],
  // 街道--社区--小区
  plotOptions: []
}
const getters = {
  addressOptions: state => state.addressOptions,
  plotOptions: state => state.plotOptions
}
const mutations = {
  SET_ADDRESS: (state, address) => {
    state.addressOptions = address
  },
  SET_PLOT: (state, plot) => {
    state.plotOptions = plot
  }
}
const actions = {
  // app.vue 获取
  getAddress({ commit }) {
    return new Promise((resolve, reject) => {
      const addressOptions = [{
        value: 'jiangsu',
        label: '江苏',
        children: [
          {
            value: 'suzhou',
            label: '苏州',
            children: [
              {
                value: 'gusu',
                label: '姑苏区',
                children: null
              },
              {
                value: 'gyyq',
                label: '工业园区'
              }
            ]
          },
          {
            value: 'wuxi',
            label: '无锡'
          }
        ]
      }, {
        value: 'zhejiang',
        label: '浙江',
        children: [
          {
            value: 'hangzhou',
            label: '杭州'
          },
          {
            value: 'ningbo',
            label: '宁波'
          }
        ]
      }
      ]
      commit('SET_ADDRESS', addressOptions)

      const plotOptions = [{
        value: 'canglang',
        label: '沧浪街道',
        children: [
          {
            value: 'shequ',
            label: '社区'
          },
          {
            value: 'shequ1',
            label: '社区1'
          }
        ]
      }
      ]
      commit('SET_PLOT', plotOptions)
      resolve('success')
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
