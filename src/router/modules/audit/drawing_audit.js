/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-31 12:03:16
 * @LastEditors: zfd
 * @Description: 审批端图审路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const drawingAuditRouter = {
  path: '/drawing-audit',
  component: Layout,
  redirect: '/drawing-audit/list',
  name: 'DrawingAudit',
  meta: {
    title: '图审',
    icon: 'institution',
    roles: ['ROLE_ADMIN', 'ROLE_DRAWING_AUDIT']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/drawing_audit/list/index.vue'), // Parent router-view
      name: 'DrawingAuditList',
      meta: {
        title: '申请列表',
        icon: 'institution',
        roles: ['ROLE_ADMIN', 'ROLE_DRAWING_AUDIT']
      }
    },
    {
      path: 'check/:id/:status',
      component: () => import('@/views/audit/drawing_audit/check/index.vue'),
      name: 'DrawingAuditCheck',
      hidden: true,
      meta: {
        title: '审核',
        roles: ['ROLE_ADMIN', 'ROLE_DRAWING_AUDIT']
      }
    },
    {
      path: 'audited-list',
      component: () => import('@/views/common/audited/list.vue'),
      name: 'DWAuditedList',
      meta: {
        title: '已审核列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_DRAWING_AUDIT']
      }
    },
    {
      path: 'audited-detail',
      component: () => import('@/views/common/audited/detail.vue'),
      name: 'DWAuditedDetail',
      hidden: true,
      meta: {
        title: '审核详情',
        icon: 'community',
        roles: ['ROLE_ADMIN', 'ROLE_DRAWING_AUDIT']
      }
    }
  ]
}

export default drawingAuditRouter
