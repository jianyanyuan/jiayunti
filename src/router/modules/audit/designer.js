/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-22 10:50:42
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
    roles: ['ROLE_ADMIN', 'ROLE_DESIGNER']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/designer/list/index.vue'), // Parent router-view
      name: 'DesignerList',
      meta: {
        title: '申请列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_DESIGNER']
      }
    },
    {
      path: 'edit/:id/:status',
      component: () => import('@/views/audit/designer/edit/index.vue'),
      name: 'DesignerEdit',
      hidden: true,
      meta: {
        title: '编辑',
        roles: ['ROLE_ADMIN', 'ROLE_DESIGNER']
      }
    },
    {
      path: 'upload/:id/:status',
      component: () => import('@/views/audit/designer/upload/index.vue'),
      name: 'DesignerUpload',
      hidden: true,
      meta: {
        title: '上传',
        roles: ['ROLE_ADMIN', 'ROLE_DESIGNER']
      }
    },
    // {
    //   path: 'view',
    //   component: () => import('@/views/audit/designer/view/index.vue'), // Parent router-view
    //   name: 'DesignerView',
    //   hidden: true,
    //   meta: {
    //     title: '查看',
    //     roles: ['ROLE_ADMIN', 'ROLE_DESIGNER']
    //   }
    // },
    {
      path: 'intro_edit',
      component: () => import('@/views/common/introduction/edit.vue'), // Parent router-view
      name: 'DesignerIntroEdit',
      // hidden: true,
      meta: {
        title: '公司介绍-编辑',
        icon: 'edit',
        roles: ['ROLE_ADMIN', 'ROLE_DESIGNER']
      }
    },
    {
      path: 'introduction',
      component: () => import('@/views/common/introduction/view.vue'), // Parent router-view
      name: 'DesignerIntro',
      // hidden: true,
      meta: {
        title: '公司介绍',
        icon: 'eye',
        roles: ['ROLE_ADMIN', 'ROLE_DESIGNER']
      }
    }
  ]
}

export default designerRouter
