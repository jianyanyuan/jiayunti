/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:14
 * @LastEditTime: 2020-11-03 09:53:25
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
    roles: ['admin', 'construction']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/implement/construction/list/index'),
      name: 'ConstructionList',
      meta: {
        title: '申请列表',
        icon: 'community',
        roles: ['admin', 'construction']
      }
    },
    {
      path: 'process',
      component: () => import('@/views/implement/construction/process/index'),
      name: 'ConstructionProcess',
      hidden: true,
      meta: {
        title: '报价',
        icon: 'collapse',
        roles: ['admin', 'construction']
      }
    },
    {
      path: 'fault',
      name: 'ConstructionFault',
      component: () => import('@/views/implement/construction/fault/index'),
      hidden: true,
      meta: {
        title: '违规',
        icon: 'card',
        roles: ['admin', 'construction']
      }
    },
    {
      path: 'complete',
      name: 'ConstructionComplete',
      component: () => import('@/views/implement/construction/complete/index'),
      hidden: true,
      meta: {
        title: '竣工验收',
        icon: 'card',
        roles: ['admin', 'construction']
      }
    }
  ]
}

export default constructionRouter
