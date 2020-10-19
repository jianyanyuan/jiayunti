/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-10-19 10:10:02
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
    roles: ['admin', 'drawing-audit']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/drawing-audit/list/index'), // Parent router-view
      name: 'DrawingAuditList',
      meta: {
        title: '申请列表',
        icon: 'list',
        roles: ['admin', 'drawing-audit']
      }
    },
    {
      path: 'check',
      component: () => import('@/views/audit/drawing-audit/check/index'),
      name: 'DrawingAuditCheck',
      meta: {
        title: '审核',
        icon: 'check',
        hidden: true,
        roles: ['admin', 'drawing-audit']
      }
    }
  ]
}

export default drawingAuditRouter
