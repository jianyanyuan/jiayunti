/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-21 17:09:01
 * @LastEditors: zfd
 * @Description: 审批端街道路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const streetRouter = {
  path: '/street',
  component: Layout,
  redirect: '/street/list',
  name: 'Street',
  meta: {
    title: '街道',
    icon: 'street',
    roles: ['ROLE_ADMIN', 'ROLE_STREET']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/street/list/index.vue'), // Parent router-view
      name: 'StreetList',
      meta: {
        title: '申请列表',
        icon: 'street',
        roles: ['ROLE_ADMIN', 'ROLE_STREET']
      }
    },
    {
      path: 'check/:id/:status',
      component: () => import('@/views/audit/street/check/index.vue'),
      name: 'StreetCheck',
      hidden: true,
      meta: {
        title: '审核',
        icon: 'check',
        roles: ['ROLE_ADMIN', 'ROLE_STREET']
      }
    },
    {
      path: 'fault-list',
      component: () => import('@/views/common/fault/list.vue'),
      name: 'StreetFaultList',
      hidden: true,
      meta: {
        title: '违规列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_STREET']
      }
    },
    {
      path: 'fault-review',
      component: () => import('@/views/common/fault/review.vue'),
      name: 'StreetFaultReview',
      hidden: true,
      meta: {
        title: '违规回复',
        roles: ['ROLE_ADMIN', 'ROLE_STREET']
      }
    },
    {
      path: 'fault-record',
      component: () => import('@/views/common/fault/record.vue'),
      name: 'StreetFaultRecord',
      hidden: true,
      meta: {
        title: '违规记录',
        roles: ['ROLE_ADMIN', 'ROLE_STREET']
      }
    },
    {
      path: 'audited-list',
      component: () => import('@/views/common/audited/list.vue'),
      name: 'StreetAuditedList',
      meta: {
        title: '已审核列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_STREET']
      }
    },
    {
      path: 'audited-detail',
      component: () => import('@/views/common/audited/detail.vue'),
      name: 'StreetAuditedDetail',
      hidden: true,
      meta: {
        title: '审核详情',
        icon: 'community',
        roles: ['ROLE_ADMIN', 'ROLE_STREET']
      }
    },
  ]
}

export default streetRouter
