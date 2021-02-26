/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-30 10:23:45
 * @LastEditors: zfd
 * @Description: 设备路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const deviceRouter = {
  path: '/device',
  component: Layout,
  redirect: '/device/list',
  name: 'Device',
  meta: {
    title: '设备',
    mean: 'user',
    icon: 'device',
    roles: ['ROLE_ADMIN', 'ROLE_DEVICE']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/device/index.vue'), // Parent router-view
      name: 'DeviceList',
      meta: {
        title: '设备列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_DEVICE']
      }
    },
    {
      path: 'intro_edit',
      component: () => import('@/views/common/introduction/edit.vue'), // Parent router-view
      name: 'DeviceIntroEdit',
      hidden: true,
      meta: {
        title: '编辑',
        icon: 'edit',
        roles: ['ROLE_ADMIN', 'ROLE_DEVICE']
      }
    },
    {
      path: 'introduction',
      component: () => import('@/views/common/introduction/view.vue'), // Parent router-view
      name: 'DeviceIntro',
      // hidden: true,
      meta: {
        title: '公司介绍',
        icon: 'eye',
        roles: ['ROLE_ADMIN', 'ROLE_DEVICE']
      }
    }
  ]
}

export default deviceRouter
