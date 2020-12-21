/*
 * @Author: zfd
 * @Date: 2020-12-17 13:48:31
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-21 11:19:36
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
    roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
  },
  
  children: [
    {
      path: 'list',
      component: () => import('@/views/implement/supervisor/list/index.vue'), // Parent router-view
      name: 'SupervisorList',
      meta: {
        title: '申请列表',
        icon: 'supervisor',
        roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
      }
    },
    {
      path: 'fault-list',
      component: () => import('@/views/common/fault/list.vue'),
      name: 'FaultList',
      hidden: true,
      meta: {
        title: '违规列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
      }
    },
    {
      path: 'fault-detail/:id/:status',
      component: () => import('@/views/common/fault/detail.vue'),
      name: 'FaultReview',
      hidden: true,
      meta: {
        title: '违规回复',
        roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
      }
    },
    {
      path: 'fault-record/:id/:status',
      component: () => import('@/views/common/fault/record.vue'),
      name: 'FaultRecord',
      hidden: true,
      meta: {
        title: '违规记录',
        roles: ['ROLE_ADMIN', 'ROLE_SUPERVISION']
      }
    }
  ]
}
export default supervisorRouter