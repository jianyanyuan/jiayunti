/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-03 15:03:50
 * @LastEditors: zfd
 * @Description: 审批端居民路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const residentRouter = {
  path: '/resident',
  component: Layout,
  redirect: '/resident/list',
  name: 'Resident',
  meta: {
    title: '居民',
    icon: 'people',
    roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
  },
  children: [
    {
      path: 'apply/:id',
      component: () => import('@/views/audit/resident/apply/index.vue'), // Parent router-view
      name: 'ResidentApply',
      hidden: true,
      meta: {
        title: '申请',
        icon: 'apply',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'list',
      component: () => import('@/views/audit/resident/list/index.vue'),
      name: 'ResidentList',
      meta: {
        title: '我的申请',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'device-list',
      component: () => import('@/views/audit/resident/device-list.vue'),
      name: 'ResidentDevice',
      meta: {
        title: '设备列表',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'designer-list',
      component: () => import('@/views/audit/resident/designer-list.vue'),
      name: 'ResidentDesigner',
      meta: {
        title: '设计单位',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'construction-list',
      component: () => import('@/views/audit/resident/construction-list.vue'),
      name: 'ResidentConstruction',
      meta: {
        title: '施工单位',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'supervisor-list',
      component: () => import('@/views/audit/resident/supervisor-list.vue'),
      name: 'ResidentSupervisor',
      meta: {
        title: '监理单位',
        icon: 'list',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'article-detail',
      component: () => import('@/views/audit/resident/article-detail.vue'),
      name: 'ResidentArticle',
      hidden: true,
      meta: {
        title: '介绍',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'audit-detail',
      component: () => import('@/views/audit/resident/audit-detail.vue'),
      name: 'ResidentAuditDetail',
      hidden: true,
      meta: {
        title: '审核结果',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'design-detail',
      component: () => import('@/views/audit/resident/design-detail.vue'),
      name: 'ResidentDesignDetail',
      hidden: true,
      meta: {
        title: '设计图',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'assents-detail',
      component: () => import('@/views/audit/resident/assents-detail.vue'),
      name: 'ResidentAssentsDetail',
      hidden: true,
      meta: {
        title: '异议反馈',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'offer',
      component: () => import('@/views/audit/resident/offer/index.vue'),
      name: 'ResidentOffer',
      hidden: true,
      meta: {
        title: '报价列表',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'offer-detail',
      component: () => import('@/views/audit/resident/offer/detail/index.vue'),
      name: 'ResidentOfferDetail',
      hidden: true,
      meta: {
        title: '报价单',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'fault-view',
      component: () => import('@/views/audit/resident/fault-view.vue'),
      name: 'ResidentFaultView',
      hidden: true,
      meta: {
        title: '违规查看',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    },
    {
      path: 'apply-notice',
      component: () => import('@/views/audit/resident/apply-notice.vue'),
      name: 'ResidentApplyNotice',
      hidden: true,
      meta: {
        title: '提交材料',
        roles: ['ROLE_ADMIN', 'ROLE_RESIDENT']
      }
    }
    // {
    //   path: 'assents-detail',
    //   component: () => import('@/views/audit/resident/assents-detail'),
    //   name: 'ResidentAssentsDetail',
    //   hidden: true,
    //   meta: {
    //     title: '异议反馈',
    //     roles: ['admin', 'resident']
    //   }
    // }
  ]
}

export default residentRouter
