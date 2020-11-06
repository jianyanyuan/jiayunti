/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:14
 * @LastEditTime: 2020-11-06 16:18:42
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
    roles: ['ROLE_ADMIN', 'ROLE_COMMUNITY']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/audit/community/list/index.vue'),
      name: 'CommunityList',
      meta: {
        title: '申请列表',
        icon: 'community',
        roles: ['ROLE_ADMIN', 'ROLE_COMMUNITY']
      }
    },
    {
      path: 'view',
      component: () => import('@/views/audit/community/view/index.vue'),
      name: 'CommunityView',
      hidden: true,
      meta: {
        title: '异议查看',
        icon: 'collapse',
        roles: ['ROLE_ADMIN', 'ROLE_COMMUNITY']
      }
    },
    {
      path: 'record',
      name: 'CommunityRecord',
      component: () => import('@/views/audit/community/record/index.vue'),
      hidden: true,
      meta: {
        title: '异议记录',
        icon: 'card',
        roles: ['ROLE_ADMIN', 'ROLE_COMMUNITY']
      }
    },
    {
      path: 'check',
      name: 'CommunityCheck',
      component: () => import('@/views/audit/community/check/index.vue'),
      hidden: true,
      meta: {
        title: '审核',
        icon: 'check',
        roles: ['ROLE_ADMIN', 'ROLE_COMMUNITY']
      }
    }
  ]
}

export default communityRouter
