/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-11-10 13:29:13
 * @LastEditors: zfd
 * @Description: 审批端设计路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const designerRouter = {
  path: '/designer',
  component: Layout,
  redirect: '/designer/list',
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
        icon: 'design',
        roles: ['admin', 'designer']
      }
    },
    {
      path: 'edit',
      component: () => import('@/views/audit/designer/edit/index'),
      name: 'DesignerEdit',
      hidden: true,
      meta: {
        title: '编辑',
        icon: 'edit',
        roles: ['admin', 'designer']
      }
    },
    {
      path: 'upload',
      component: () => import('@/views/audit/designer/upload/index'),
      name: 'DesignerUpload',
      hidden: true,
      meta: {
        title: '上传',
        icon: 'edit',
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
        roles: ['admin', 'designer']
      }
    },
    {
      path: 'intro_edit',
      component: () => import('@/views/audit/designer/intro_edit/index'), // Parent router-view
      name: 'DesignerIntroEdit',
      // hidden: true,
      meta: {
        title: '公司介绍-编辑',
        icon: 'eye',
        roles: ['admin', 'designer']
      }
    },
    {
      path: 'introduction',
      component: () => import('@/views/audit/designer/introduction/index'), // Parent router-view
      name: 'DesignerIntro',
      // hidden: true,
      meta: {
        title: '公司介绍',
        icon: 'eye',
        roles: ['admin', 'designer']
      }
    }
  ]
}

export default designerRouter
