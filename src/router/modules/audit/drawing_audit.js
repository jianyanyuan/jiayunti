/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-10-23 13:21:37
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
    roles: ['admin', 'drawing_audit']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/drawing_audit/list/index'), // Parent router-view
      name: 'DrawingAuditList',
      meta: {
        title: '申请列表',
        icon: 'institution',
        roles: ['admin', 'drawing_audit']
      }
    },
    {
      path: 'check',
      component: () => import('@/views/audit/drawing_audit/check/index'),
      name: 'DrawingAuditCheck',
      hidden: true,
      meta: {
        title: '审核',
        icon: 'check',
        roles: ['admin', 'drawing_audit']
      }
    }
  ]
}

export default drawingAuditRouter
