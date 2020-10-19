/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:14
 * @LastEditTime: 2020-10-19 10:02:26
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
        icon: 'list',
        roles: ['admin', 'community']
      }
    },
    {
      path: 'view',
      component: () => import('@/views/audit/community/view/index'),
      name: 'CommunityView',
      meta: {
        title: '异议查看',
        icon: 'collapse',
        hidden: true,
        roles: ['admin', 'community']
      }
    },
    {
      path: 'record',
      name: 'CommunityRecord',
      component: () => import('@/views/audit/community/record/index'),
      meta: {
        title: '异议记录',
        icon: 'card',
        hidden: true,
        roles: ['admin', 'community']
      }
    },
    {
      path: 'check',
      name: 'CommunityCheck',
      component: () => import('@/views/audit/community/check/index'),
      meta: {
        title: '审核',
        icon: 'check',
        hidden: true,
        roles: ['admin', 'community']
      }
    }
  ]
}

export default communityRouter
