/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-10-19 15:05:57
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
    roles: ['admin', 'street']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/street/list/index'), // Parent router-view
      name: 'StreetList',
      meta: {
        title: '申请列表',
        icon: 'street',
        roles: ['admin', 'street']
      }
    },
    {
      path: 'check',
      component: () => import('@/views/audit/street/check/index'),
      name: 'StreetCheck',
      // hidden: true,
      meta: {
        title: '审核',
        icon: 'check',
        roles: ['admin', 'street']
      }
    }
  ]
}

export default streetRouter
