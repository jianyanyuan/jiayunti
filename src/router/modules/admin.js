/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-23 09:35:37
 * @LastEditors: zfd
 * @Description: 审批端设计路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: '/resident/apply',
  meta: {
    title: '管理员',
    icon: 'community',
    roles: ['admin']
  },
  children: [
    {
      path: 'super_chart',
      component: () => import('@/views/charts/increase_lift.vue'),
      name: 'SuperChart',
      meta: {
        title: '总图表',
        icon: 'community',
        roles: ['admin']
      }
    },
    {
      path: 'street_chart',
      component: () => import('@/views/charts/street.vue'),
      name: 'StreetChart',
      meta: {
        title: '街道图表',
        icon: 'street',
        roles: ['admin']
      }
    }
  ]
}

export default adminRouter
