/*
 * @Author: zfd
 * @Date: 2020-12-17 13:48:31
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 12:03:29
 * @Description: 监理单位路由表
 */
import Layout from '@/layout'

const supervisorRouter = {
  path: '/supervision',
  component: Layout,
  redirect: '/supervision/list',
  name: 'Supervisor',
  meta: {
    title: '监理单位',
    icon: 'supervisor',
    mean: 'user',
    roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
  },

  children: [
    {
      path: 'list',
      component: () => import('@/views/implement/supervisor/list/index.vue'), // Parent router-view
      name: 'SupervisorList',
      meta: {
        title: '申请列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
      }
    },
    {
      path: 'fault-list',
      component: () => import('@/views/common/fault/list.vue'),
      name: 'SuperFaultList',
      hidden: true,
      meta: {
        title: '违规列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
      }
    },
    {
      path: 'fault-review',
      component: () => import('@/views/common/fault/review.vue'),
      name: 'SuperFaultReview',
      hidden: true,
      meta: {
        title: '违规回复',
        roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
      }
    },
    {
      path: 'fault-record',
      component: () => import('@/views/common/fault/record.vue'),
      name: 'SuperFaultRecord',
      hidden: true,
      meta: {
        title: '违规记录',
        roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
      }
    },
    {
      path: 'intro_edit',
      component: () => import('@/views/common/introduction/edit.vue'), // Parent router-view
      name: 'SuperIntroEdit',
      hidden: true,
      meta: {
        title: '编辑',
        icon: 'edit',
        roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
      }
    },
    {
      path: 'introduction',
      component: () => import('@/views/common/introduction/view.vue'), // Parent router-view
      name: 'SuperIntro',
      // hidden: true,
      meta: {
        title: '公司介绍',
        icon: 'eye',
        roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
      }
    }
  ]
}
export default supervisorRouter
