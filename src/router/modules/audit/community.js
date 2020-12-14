/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:14
 * @LastEditTime: 2020-12-14 17:08:25
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
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_COMMUNITY']
      }
    },
    {
      path: 'audited-list',
      component: () => import('@/views/audit/community/audited/list.vue'),
      name: 'CommunityAuditedList',
      meta: {
        title: '已审核列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_COMMUNITY']
      }
    },
    {
      path: 'audited-detail/:id',
      component: () => import('@/views/audit/community/audited/detail.vue'),
      name: 'CommunityAuditedDetail',
      hidden: true,
      meta: {
        title: '审核详情',
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
      path: 'record/:id/:status',
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
      path: 'check/:id/:status',
      name: 'CommunityCheck',
      component: () => import('@/views/audit/community/check/index.vue'),
      hidden: true,
      meta: {
        title: '审核',
        icon: 'check',
        roles: ['ROLE_ADMIN', 'ROLE_COMMUNITY']
      }
    },
    {
      path: 'check-notice/:id/:status',
      name: 'CommunityCheckS',
      component: () => import('@/views/audit/community/check/notice.vue'),
      hidden: true,
      meta: {
        title: '公示审核',
        icon: 'check',
        roles: ['ROLE_ADMIN', 'ROLE_COMMUNITY']
      }
    }
  ]
}

export default communityRouter
