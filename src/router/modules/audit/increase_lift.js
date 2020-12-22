/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-22 10:13:35
 * @LastEditors: zfd
 * @Description: 增梯办路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const inlRouter = {
  path: '/increase-lift',
  component: Layout,
  redirect: '/increase-lift/list',
  name: 'IncreaseLift',
  meta: {
    title: '增梯办',
    icon: 'institution',
    roles: ['ROLE_ADMIN', 'ROLE_INCREASE_LIFT']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/increase_lift/list/index.vue'), // Parent router-view
      name: 'IncreaseLiftList',
      meta: {
        title: '申请列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_INCREASE_LIFT']
      }
    },
    {
      path: 'report/:id/:status',
      component: () => import('@/views/audit/increase_lift/report/index.vue'),
      name: 'IncreaseLiftReport',
      hidden: true,
      meta: {
        title: '上传报告',
        roles: ['ROLE_ADMIN', 'ROLE_INCREASE_LIFT']
      }
    },
    {
      path: 'pipe/:id/:status',
      component: () => import('@/views/audit/increase_lift/pipe/index.vue'),
      name: 'IncreaseLiftPipe',
      hidden: true,
      meta: {
        title: '管道踏勘',
        roles: ['ROLE_ADMIN', 'ROLE_INCREASE_LIFT']
      }

    },
    {
      path: 'fault-detail',
      component: () => import('@/views/common/fault/detail.vue'),
      name: 'INLFaultDetail',
      hidden: true,
      meta: {
        title: '违规查看',
        roles: ['ROLE_ADMIN', 'ROLE_INCREASE_LIFT']
      }
    },
    {
      path: 'bonus',
      component: () => import('@/views/common/bonus.vue'),
      name: 'InLBonus',
      hidden: true,
      meta: {
        title: '补贴派发',
        roles: ['ROLE_ADMIN', 'ROLE_INCREASE_LIFT']
      }
    },
    
  ]
}

export default inlRouter
