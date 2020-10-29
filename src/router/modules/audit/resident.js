/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-10-29 16:17:58
 * @LastEditors: zfd
 * @Description: 审批端居民路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const residentRouter = {
  path: '/resident',
  component: Layout,
  redirect: '/resident/list',
  name: 'Resident',
  meta: {
    title: '居民',
    icon: 'people',
    roles: ['admin', 'resident']
  },
  children: [
    {
      path: 'apply',
      component: () => import('@/views/audit/resident/apply/index'), // Parent router-view
      name: 'ResidentApply',
      meta: {
        title: '申请',
        icon: 'apply',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'list',
      component: () => import('@/views/audit/resident/list/index'),
      name: 'ResidentList',
      meta: {
        title: '列表',
        icon: 'list',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'device-list',
      component: () => import('@/views/audit/resident/device_list/index'),
      name: 'ResidentDevice',
      meta: {
        title: '设备列表',
        icon: 'list',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'designer-list',
      component: () => import('@/views/audit/resident/designer_list/index'),
      name: 'ResidentDesigner',
      meta: {
        title: '设计单位',
        icon: 'list',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'construction-list',
      component: () => import('@/views/audit/resident/construction_list/index'),
      name: 'ResidentConstruction',
      meta: {
        title: '施工单位',
        icon: 'list',
        roles: ['admin', 'resident']
      }
    }
  ]
}

export default residentRouter
