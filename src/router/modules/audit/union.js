/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-16 11:12:18
 * @LastEditors: zfd
 * @Description: 审批端联合审查路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const unionRouter = {
  path: '/union',
  component: Layout,
  redirect: '/union/list',
  name: 'Union',
  meta: {
    title: '联合审查',
    icon: 'institution',
    roles: ['ROLE_ADMIN', 'ROLE_Capital_Rule','ROLE_House_Construction','ROLE_Urban_Management','ROLE_Market_Supervisor']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/union/list/index.vue'), // Parent router-view
      name: 'UnionList',
      meta: {
        title: '申请列表',
        icon: 'street',
        roles: ['ROLE_ADMIN', 'ROLE_Capital_Rule','ROLE_House_Construction','ROLE_Urban_Management','ROLE_Market_Supervisor']
      }
    },
    {
      path: 'check/:id/:status',
      component: () => import('@/views/audit/street/check/index.vue'),
      name: 'UnionCheck',
      hidden: true,
      meta: {
        title: '审核',
        icon: 'check',
        roles: ['ROLE_ADMIN', 'ROLE_Capital_Rule','ROLE_House_Construction','ROLE_Urban_Management','ROLE_Market_Supervisor']
      }
    }
    // {
    //   path: 'handle_fault/:id/:status',
    //   component: () => import('@/views/audit/street/handle_fault.vue'),
    //   name: 'StreetHandleFault',
    //   hidden: true,
    //   meta: {
    //     title: '违规回复',
    //     icon: 'check',
    //     roles: ['ROLE_ADMIN', 'ROLE_STREET']
    //   }
    // }
    
  ]
}

export default unionRouter
