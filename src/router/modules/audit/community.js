/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:14
 * @LastEditTime: 2020-11-10 13:17:16
 * @LastEditors: zfd
 * @Description: 审批端社区路由表
 * @FilePath: \jiayunti\src\router\modules\audit\community.js
 */
import Layout from '@/layout'

const communityRouter = {
  path: '/community',
  component: Layout,
  redirect: '/community/list',
  name: 'Community',
  meta: {
    title: '社区',
    icon: 'community',
    roles: ['admin', 'community']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/community/list/index'),
      name: 'CommunityList',
      meta: {
        title: '申请列表',
        icon: 'community',
        roles: ['admin', 'community']
      }
    },
    {
      path: 'view',
      component: () => import('@/views/audit/community/view/index'),
      name: 'CommunityView',
      hidden: true,
      meta: {
        title: '异议查看',
        icon: 'collapse',
        roles: ['admin', 'community']
      }
    },
    {
      path: 'record',
      name: 'CommunityRecord',
      component: () => import('@/views/audit/community/record/index'),
      hidden: true,
      meta: {
        title: '异议记录',
        icon: 'card',
        roles: ['admin', 'community']
      }
    },
    {
      path: 'check',
      name: 'CommunityCheck',
      component: () => import('@/views/audit/community/check/index'),
      hidden: true,
      meta: {
        title: '审核',
        icon: 'check',
        roles: ['admin', 'community']
      }
    }
  ]
}

export default communityRouter
