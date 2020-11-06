/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-11-06 15:01:28
 * @LastEditors: zfd
 * @Description: 审批端图审路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const drawingAuditRouter = {
  path: '/drawing_audit',
  component: Layout,
  redirect: '/drawing_audit/list',
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
      path: 'check',
      component: () => import('@/views/audit/drawing_audit/check/index.vue'),
      name: 'DrawingAuditCheck',
      hidden: true,
      meta: {
        title: '审核',
        icon: 'check',
        roles: ['ROLE_ADMIN', 'ROLE_DRAWING_AUDIT']
      }
    }
  ]
}

export default drawingAuditRouter
