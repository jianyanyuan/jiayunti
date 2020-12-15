/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-15 09:22:36
 * @LastEditors: zfd
 * @Description: 增梯办路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const drawingAuditRouter = {
  path: '/increase-lift',
  component: Layout,
  redirect: '/increase-lift/list',
  name: 'IncreaseLift',
  meta: {
    title: '增梯办',
    icon: 'institution',
    roles: ['ROLE_ADMIN', 'ROLE_INCREASE_LIFT']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/increase_lift/list/index.vue'), // Parent router-view
      name: 'IncreaseLiftList',
      meta: {
        title: '申请列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_INCREASE_LIFT']
      }
    },
    {
      path: 'report/:id/:status',
      component: () => import('@/views/audit/increase_lift/report/index.vue'),
      name: 'IncreaseLiftReport',
      hidden: true,
      meta: {
        title: '上传报告',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_INCREASE_LIFT']
      }
    },
    {
      path: 'pipe/:id/:status',
      component: () => import('@/views/audit/increase_lift/pipe/index.vue'),
      name: 'IncreaseLiftPipe',
      hidden: true,
      meta: {
        title: '管道踏勘',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_INCREASE_LIFT']
      }

    },
    {
      path: 'fault-view/:id/:status',
      component: () => import('@/views/audit/increase_lift/fault-view.vue'),
      name: 'IncreaseLiftFaultView',
      hidden: true,
      meta: {
        title: '违规查看',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_INCREASE_LIFT']
      }
    }
  ]
}

export default drawingAuditRouter
