/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-10-23 14:08:07
 * @LastEditors: zfd
 * @Description: 增梯办路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const drawingAuditRouter = {
  path: '/increase_lift',
  component: Layout,
  redirect: '/increase_lift/list',
  name: 'IncreaseLift',
  meta: {
    title: '增梯办',
    icon: 'institution',
    roles: ['admin', 'increase_lift']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/increase_lift/list/index'), // Parent router-view
      name: 'IncreaseLiftList',
      meta: {
        title: '申请列表',
        icon: 'institution',
        roles: ['admin', 'increase_lift']
      }
    },
    {
      path: 'report',
      component: () => import('@/views/audit/increase_lift/report/index'),
      name: 'IncreaseLiftCheck',
      hidden: true,
      meta: {
        title: '上传报告',
        icon: '',
        roles: ['admin', 'increase_lift']
      }
    },
    {
      path: 'report',
      component: () => import('@/views/audit/increase_lift/report/index'),
      name: 'IncreaseLiftCheck',
      hidden: true,
      meta: {
        title: '管道踏勘',
        icon: '',
        roles: ['admin', 'increase_lift']
      }
    }
  ]
}

export default drawingAuditRouter
