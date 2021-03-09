/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-22 10:41:29
 * @LastEditors: zfd
 * @Description: 审批端设计路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: '/admin/setting',
  name: 'Admin',
  meta: {
    title: '网站管理员',
    mean: 'user',
    roles: ['ROLE_ADMIN']
  },
  children: [
    {
      path: '/admin/setting',
      component: () => import('@/views/admin/setting.vue'), // Parent router-view
      name: 'AdminSetting',
      meta: {
        title: '节点设置',
        icon: 'people',
        roles: ['ROLE_ADMIN']
      }
    },
    {
      path: '/admin/region',
      component: () => import('@/views/admin/region.vue'), // Parent router-view
      name: 'AdminRegion',
      meta: {
        title: '行政区域变更',
        icon: 'people',
        roles: ['ROLE_ADMIN']
      }
    },
    {
      path: '/admin/audit',
      component: () => import('@/views/admin/audit.vue'), // Parent router-view
      name: 'AdminAudit',
      meta: {
        title: '企业初审',
        icon: 'people',
        roles: ['ROLE_ADMIN']
      }
    }
  ]
}

export default adminRouter
