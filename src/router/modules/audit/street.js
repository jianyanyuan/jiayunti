/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-11-06 14:52:11
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
      path: 'check',
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
      path: 'handle_fault',
      component: () => import('@/views/audit/street/handle_fault.vue'),
      name: 'StreetHandleFault',
      hidden: true,
      meta: {
        title: '违规处理',
        icon: 'check',
        roles: ['ROLE_ADMIN', 'ROLE_STREET']
      }
    },
    {
      path: 'record_fault',
      component: () => import('@/views/audit/street/record_fault.vue'),
      name: 'StreetRecordFault',
      hidden: true,
      meta: {
        title: '违规记录',
        icon: 'check',
        roles: ['ROLE_ADMIN', 'ROLE_STREET']
      }
    }
  ]
}

export default streetRouter
