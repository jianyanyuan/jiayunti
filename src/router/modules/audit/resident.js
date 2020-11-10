/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-11-02 09:09:21
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
    roles: ['admin', 'resident']
  },
  children: [
    {
      path: 'apply',
      component: () => import('@/views/audit/resident/apply/index'), // Parent router-view
      name: 'ResidentApply',
      hidden: true,
      meta: {
        title: '申请',
        icon: 'apply',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'list',
      component: () => import('@/views/audit/resident/list'),
      name: 'ResidentList',
      meta: {
        title: '我的申请',
        icon: 'list',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'apply-notice',
      component: () => import('@/views/audit/resident/apply-notice.vue'),
      name: 'ResidentApplyNotice',
      hidden: true,
      meta: {
        title: '提交材料',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'device-list',
      component: () => import('@/views/audit/resident/device-list'),
      name: 'ResidentDevice',
      meta: {
        title: '设备列表',
        icon: 'list',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'designer-list',
      component: () => import('@/views/audit/resident/designer-list'),
      name: 'ResidentDesigner',
      meta: {
        title: '设计单位',
        icon: 'list',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'construction-list',
      component: () => import('@/views/audit/resident/construction-list'),
      name: 'ResidentConstruction',
      meta: {
        title: '施工单位',
        icon: 'list',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'supervisor-list',
      component: () => import('@/views/audit/resident/supervisor-list'),
      name: 'ResidentSupervisor',
      meta: {
        title: '监理单位',
        icon: 'list',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'article-detail',
      component: () => import('@/views/audit/resident/article-detail'),
      name: 'ResidentArticle',
      hidden: true,
      meta: {
        title: '介绍',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'audit-detail',
      component: () => import('@/views/audit/resident/audit-detail'),
      name: 'ResidentAuditDetail',
      hidden: true,
      meta: {
        title: '审核结果',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'design-detail',
      component: () => import('@/views/audit/resident/design-detail'),
      name: 'ResidentDesignDetail',
      hidden: true,
      meta: {
        title: '设计图',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'assents-detail',
      component: () => import('@/views/audit/resident/assents-detail'),
      name: 'ResidentAssentsDetail',
      hidden: true,
      meta: {
        title: '异议反馈',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'offer',
      component: () => import('@/views/audit/resident/offer'),
      name: 'ResidentOffer',
      hidden: true,
      meta: {
        title: '报价列表',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'offer-detail',
      component: () => import('@/views/audit/resident/offer/detail'),
      name: 'ResidentOfferDetail',
      hidden: true,
      meta: {
        title: '报价单',
        roles: ['admin', 'resident']
      }
    },
    {
      path: 'fault-view',
      component: () => import('@/views/audit/resident/fault-view.vue'),
      name: 'ResidentFaultView',
      hidden: true,
      meta: {
        title: '违规查看',
        roles: ['admin', 'resident']
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
