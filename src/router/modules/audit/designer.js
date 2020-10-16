/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-10-16 10:08:24
 * @LastEditors: zfd
 * @Description: 审批端设计路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const designerRouter = {
  path: '/audit/designer',
  component: Layout,
  redirect: '/audit/designer/list',
  name: 'Designer',
  meta: {
    title: '设计',
    icon: 'design',
    roles: ['admin', 'designer']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/designer/list/index'), // Parent router-view
      name: 'DesignerList',
      meta: {
        title: '申请列表',
        icon: 'list',
        roles: ['admin', 'designer']
      }
    },
    {
      path: 'edit',
      component: () => import('@/views/audit/designer/edit/index'),
      name: 'DesignerEdit',
      meta: {
        title: '编辑',
        icon: 'edit',
        hidden: true,
        roles: ['admin', 'designer']
      }
    },
    {
      path: 'view',
      component: () => import('@/views/audit/designer/view/index'), // Parent router-view
      name: 'DesignerView',
      hidden: true,
      meta: {
        title: '查看',
        icon: 'eye',
        hidden: true,
        roles: ['admin', 'designer']
      }
    }
  ]
}

export default designerRouter
