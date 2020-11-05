/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-11-03 10:25:13
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
        icon: 'list',
        roles: ['admin', 'increase_lift']
      }
    },
    {
      path: 'report',
      component: () => import('@/views/audit/increase_lift/report/index'),
      name: 'IncreaseLiftReport',
      hidden: true,
      meta: {
        title: '上传报告',
        icon: 'list',
        roles: ['admin', 'increase_lift']
      }
    },
    {
      path: 'pipe',
      component: () => import('@/views/audit/increase_lift/pipe/index'),
      name: 'IncreaseLiftPipe',
      hidden: true,
      meta: {
        title: '管道踏勘',
        icon: 'list',
        roles: ['admin', 'increase_lift']
      }

    },
    {
      path: 'fault-view',
      component: () => import('@/views/audit/increase_lift/fault-view.vue'),
      name: 'IncreaseLiftFaultView',
      hidden: true,
      meta: {
        title: '违规查看',
        icon: 'list',
        roles: ['admin', 'increase_lift']
      }
    }
  ]
}

export default drawingAuditRouter
