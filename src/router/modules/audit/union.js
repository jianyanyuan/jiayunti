/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-17 13:22:48
 * @LastEditors: zfd
 * @Description: 审批端联合审查路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const unionRouter = {
  path: '/union',
  component: Layout,
  redirect: '/union/list',
  name: 'Union',
  meta: {
    title: '联合审查',
    icon: 'institution',
    roles: ['ROLE_ADMIN', 'ROLE_CAPITAL_RULE','ROLE_HOUSE_CONSTRUCTION','ROLE_URBAN_MANAGEMENT','ROLE_MARKET_SUPERVISOR']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/union/list/index.vue'), // Parent router-view
      name: 'UnionList',
      meta: {
        title: '申请列表',
        icon: 'street',
        roles: ['ROLE_ADMIN', 'ROLE_CAPITAL_RULE','ROLE_HOUSE_CONSTRUCTION','ROLE_URBAN_MANAGEMENT','ROLE_MARKET_SUPERVISOR']
      }
    },
    {
      path: 'check/:id/:status',
      component: () => import('@/views/audit/street/check/index.vue'),
      name: 'UnionCheck',
      hidden: true,
      meta: {
        title: '审核',
        icon: 'check',
        roles: ['ROLE_ADMIN', 'ROLE_CAPITAL_RULE','ROLE_HOUSE_CONSTRUCTION','ROLE_URBAN_MANAGEMENT','ROLE_MARKET_SUPERVISOR']
      }
    },
    {
      path: 'audited-list',
      component: () => import('@/views/common/audited/list.vue'),
      name: 'AuditedList',
      meta: {
        title: '已审核列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_CAPITAL_RULE','ROLE_HOUSE_CONSTRUCTION','ROLE_URBAN_MANAGEMENT','ROLE_MARKET_SUPERVISOR']
      }
    },
    {
      path: 'audited-detail/:id',
      component: () => import('@/views/common/audited/detail.vue'),
      name: 'AuditedDetail',
      hidden: true,
      meta: {
        title: '审核详情',
        icon: 'community',
        roles: ['ROLE_ADMIN', 'ROLE_CAPITAL_RULE','ROLE_HOUSE_CONSTRUCTION','ROLE_URBAN_MANAGEMENT','ROLE_MARKET_SUPERVISOR']
      }
    },
    
    
  ]
}

export default unionRouter
