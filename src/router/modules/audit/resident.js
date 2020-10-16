/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-10-16 10:08:04
 * @LastEditors: zfd
 * @Description: 审批端居民路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const residentRouter = {
  path: '/audit/resident',
  component: Layout,
  redirect: '/audit/resident/apply',
  name: 'Resident',
  meta: {
    title: '居民',
    icon: 'resident',
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
    }
  ]
}

export default residentRouter
