/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:14
 * @LastEditTime: 2020-12-22 10:19:57
 * @LastEditors: zfd
 * @Description: 实施段施工路由表
 * @FilePath: \jiayunti\src\router\modules\implement\construction.js
 */
import Layout from '@/layout'

const constructionRouter = {
  path: '/construction',
  component: Layout,
  redirect: '/construction/list',
  name: 'Construction',
  meta: {
    title: '施工单位',
    icon: 'community',
    roles: ['ROLE_ADMIN', 'ROLE_CONSTRUCTION']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/implement/construction/list/index.vue'),
      name: 'ConstructionList',
      meta: {
        title: '申请列表',
        icon: 'community',
        roles: ['ROLE_ADMIN', 'ROLE_CONSTRUCTION']
      }
    },
    {
      path: 'process/:id/:status',
      component: () => import('@/views/implement/construction/process/index.vue'),
      name: 'ConstructionProcess',
      hidden: true,
      meta: {
        title: '报价',
        roles: ['ROLE_ADMIN', 'ROLE_CONSTRUCTION']
      }
    },
    {
      path: 'fault/:id/:status',
      name: 'ConstructionFault',
      component: () => import('@/views/implement/construction/fault/index.vue'),
      hidden: true,
      meta: {
        title: '违规',
        roles: ['ROLE_ADMIN', 'ROLE_CONSTRUCTION']
      }
    },
    {
      path: 'complete',
      name: 'ConstructionComplete',
      component: () => import('@/views/implement/construction/complete/index.vue'),
      hidden: true,
      meta: {
        title: '竣工验收',
        roles: ['ROLE_ADMIN', 'ROLE_CONSTRUCTION']
      }
    }
  ]
}

export default constructionRouter
