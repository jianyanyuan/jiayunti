/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 12:00:02
 * @Description: 申请项目仓库
 */
import { listApi } from '@/api/projects'

const state = {
  // 当前申请是否为委托
  isDelegated: false,
  applyStatus: [
    { key: 0, val: '申请中' },
    { key: 1, val: '社区受理' },
    { key: 2, val: '方案设计' },
    { key: 3, val: '公示阶段' }, // 社区异议记录 居民异议查看  居民提交材料
    { key: 4, val: '公示审核' },
    { key: 5, val: '管道踏勘' },
    { key: 6, val: '施工图设计' },
    { key: 7, val: '施工图审核' },
    { key: 8, val: '施工报价' },
    { key: 9, val: '街道审核' },
    { key: 10, val: '联合审查' },
    // { key: 11, val: '审核通过' },
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
  // 项目操作
  operations: {
    // 申请中
    0: [
      {
        // 按钮名
        o: '提交材料',
        // 按钮大小
        s: 'mini',
        // 按钮类型
        t: 'warning',
        // 页面名
        uN: 'ResidentApply',
        // 角色
        r: ['ROLE_PRINCIPAL'] // 委托代理人
      },
      {
        o: '查看材料',
        s: 'mini',
        t: 'warning',
        uN: 'ResidentApply',
        r: ['ROLE_RESIDENT']
      },
      {
        o: '审核意见',
        s: 'mini',
        t: 'danger',
        uN: 'ResidentAuditDetail',
        r: ['ROLE_PRINCIPAL', 'ROLE_RESIDENT'],
        // 项目未通过
        status: 1
      }
    ],
    // 社区受理
    1: [
      {
        o: '审核',
        s: 'mini',
        t: 'warning',
        uN: 'CommunityCheck',
        r: ['ROLE_COMMUNITY']
      },
      // {
      //   o: '查看材料',
      //   s: 'mini',
      //   t: 'warning',
      //   uN: 'ResidentApplyRead',
      //   r: ['ROLE_RESIDENT'] // 自行
      // },
      {
        o: '审核意见',
        s: 'mini',
        t: 'danger',
        uN: 'ResidentAuditDetail',
        r: ['ROLE_PRINCIPAL', 'ROLE_RESIDENT'],
        // 项目状态
        status: 1
      }
    ],
    // 方案设计
    2: [
      {
        o: '上传',
        s: 'mini',
        t: 'warning',
        uN: 'DesignerUpload',
        r: ['ROLE_DESIGNER']
      }
    ],
    // 公示阶段
    3: [
      {
        o: '提交材料',
        s: 'mini',
        t: 'primary',
        uN: 'ResidentApplyNotice',
        r: ['ROLE_PRINCIPAL']
      },
      {
        o: '查看材料',
        s: 'mini',
        t: 'primary',
        uN: 'ResidentNoticeRead',
        r: ['ROLE_RESIDENT']
      },
      {
        o: '异议反馈',
        s: 'mini',
        t: 'warning',
        uN: 'ResidentAssentsDetail',
        r: ['ROLE_PRINCIPAL', 'ROLE_RESIDENT']
      },
      {
        o: '异议记录',
        s: 'mini',
        t: 'warning',
        uN: 'CommunityRecord',
        r: ['ROLE_COMMUNITY']
      }
    ],
    // 公示审核
    4: [
      {
        o: '审核',
        s: 'mini',
        t: 'warning',
        uN: 'CommunityCheckNotice',
        r: ['ROLE_COMMUNITY']
      }
    ],
    // 管道踏勘
    5: [
      {
        o: '管道踏勘',
        s: 'mini',
        t: 'warning',
        uN: 'IncreaseLiftPipe',
        r: ['ROLE_INCREASE_LIFT']
      }
    ],
    // 施工图设计
    6: [
      {
        o: '修改',
        s: 'mini',
        t: 'primary',
        uN: 'DesignerEdit',
        r: ['ROLE_DESIGNER'],
        status: 7
      }
    ],
    // 施工图审核
    7: [
      {
        o: '查看设计',
        s: 'mini',
        t: 'success',
        uN: 'ResidentDesignDetail',
        r: ['ROLE_PRINCIPAL', 'ROLE_RESIDENT']
      },
      {
        o: '审核',
        s: 'mini',
        t: 'primary',
        uN: 'DrawingAuditCheck',
        r: ['ROLE_DRAWING_AUDIT']
      }
    ],
    // 街道审核
    9: [
      {
        o: '审核',
        s: 'mini',
        t: 'warning',
        uN: 'StreetCheck',
        r: ['ROLE_STREET']
      }
    ],
    // 联合审查
    10: [
      {
        o: '上传报告',
        s: 'mini',
        t: 'warning',
        uN: 'IncreaseLiftReport',
        r: ['ROLE_INCREASE_LIFT']
      },
      {
        o: '审核',
        s: 'mini',
        t: 'warning',
        uN: 'UnionCheck',
        r: ['ROLE_CAPITAL_RULE', 'ROLE_HOUSE_CONSTRUCTION', 'ROLE_URBAN_MANAGEMENT', 'ROLE_MARKET_SUPERVISOR']
      }
    ],
    // 施工中
    11: [
      {
        o: '违规查看',
        s: 'mini',
        t: 'warning',
        uP: '/resident/fault-detail',
        r: ['ROLE_PRINCIPAL', 'ROLE_RESIDENT']
      },
      {
        o: '违规查看',
        s: 'mini',
        t: 'warning',
        uP: '/increase-lift/fault-detail',
        r: ['ROLE_INCREASE_LIFT']
      },
      {
        o: '违规查看',
        s: 'mini',
        t: 'warning',
        uN: 'ConstructionFault',
        r: ['ROLE_CONSTRUCTION']
      },
      {
        o: '违规记录',
        s: 'mini',
        t: 'info',
        uP: '/street/fault-record',
        r: ['ROLE_STREET']
      },
      {
        o: '违规处理',
        s: 'mini',
        t: 'warning',
        uP: '/street/fault-review',
        r: ['ROLE_STREET']
      },
      {
        o: '违规记录',
        s: 'mini',
        t: 'info',
        uP: '/supervision/fault-record',
        r: ['ROLE_SUPERVISION']
      },
      {
        o: '违规处理',
        s: 'mini',
        t: 'warning',
        uP: '/supervision/fault-review',
        r: ['ROLE_SUPERVISION']
      }
    ],
    // 竣工验收
    12: [
      {
        o: '补贴查看',
        s: 'mini',
        t: 'success',
        uP: '/resident/bonus',
        r: ['ROLE_PRINCIPAL', 'ROLE_RESIDENT']
      },
      {
        o: '补贴派发',
        s: 'mini',
        t: 'warning',
        uP: '/increase-lift/bonus',
        r: ['ROLE_INCREASE_LIFT']
      }
    ],
    // 驳回
    13: [
      {
        o: '驳回原因',
        s: 'mini',
        t: 'danger',
        uN: 'ResidentAuditDetail',
        r: ['ROLE_PRINCIPAL', 'ROLE_RESIDENT']
      }
    ]
  }
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

