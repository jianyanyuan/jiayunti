/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-31 08:18:00
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
    mean: 'user',
    icon: 'people',
    roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']
  },
  children: [
    {
      path: 'apply/:id/:status',
      component: () => import('@/views/audit/resident/apply/index.vue'), // Parent router-view
      name: 'ResidentApply',
      hidden: true,
      meta: {
        title: '申请',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']
      }
    },
    {
      path: 'list',
      component: () => import('@/views/audit/resident/list/index.vue'),
      name: 'ResidentList',
      meta: {
        title: '我的申请',
        icon: 'list',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']
      }
    },
    {
      path: 'device-list',
      component: () => import('@/views/audit/resident/device-list.vue'),
      name: 'ResidentDevice',
      meta: {
        title: '设备列表',
        icon: 'device',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']
      }
    },
    {
      path: 'designer-list',
      component: () => import('@/views/audit/resident/designer-list.vue'),
      name: 'ResidentDesigner',
      meta: {
        title: '设计单位',
        icon: 'design',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']
      }
    },
    {
      path: 'construction-list',
      component: () => import('@/views/audit/resident/construction-list.vue'),
      name: 'ResidentConstruction',
      meta: {
        title: '施工单位',
        icon: 'construction',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']
      }
    },
    {
      path: 'supervisor-list',
      component: () => import('@/views/audit/resident/supervisor-list.vue'),
      name: 'ResidentSupervisor',
      meta: {
        title: '监理单位',
        icon: 'supervisor',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']
      }
    },
    {
      path: 'article-detail/:id',
      component: () => import('@/views/audit/resident/article-detail.vue'),
      name: 'ResidentArticle',
      hidden: true,
      meta: {
        title: '单位介绍',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']
      }
    },
    {
      path: 'audited-detail/:id/:status',
      component: () => import('@/views/audit/resident/audit-detail.vue'),
      name: 'ResidentAuditDetail',
      hidden: true,
      meta: {
        title: '审核意见',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']
      }
    },
    {
      path: 'design-detail/:id/:status',
      component: () => import('@/views/audit/resident/design-detail.vue'),
      name: 'ResidentDesignDetail',
      hidden: true,
      meta: {
        title: '设计图',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']
      }
    },
    {
      path: 'assents-detail/:id/:status',
      component: () => import('@/views/audit/resident/assents-detail.vue'),
      name: 'ResidentAssentsDetail',
      hidden: true,
      meta: {
        title: '异议反馈',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']
      }
    },
    // {
    //   path: 'offer/:id/:status',
    //   component: () => import('@/views/audit/resident/offer/index.vue'),
    //   name: 'ResidentOffer',
    //   hidden: true,
    //   meta: {
    //     title: '报价列表',
    //     roles: [ 'ROLE_RESIDENT', 'ROLE_PRINCIPAL']

    //   }
    // },
    // {
    //   path: 'offer-detail/:id/:offerId/:status',
    //   component: () => import('@/views/audit/resident/offer/detail/index.vue'),
    //   name: 'ResidentOfferDetail',
    //   hidden: true,
    //   meta: {
    //     title: '报价单',
    //     roles: [ 'ROLE_RESIDENT', 'ROLE_PRINCIPAL']

    //   }
    // },
    {
      path: 'fault-detail',
      component: () => import('@/views/common/fault/detail.vue'),
      name: 'ResFaultDetail',
      hidden: true,
      meta: {
        title: '违规查看',
        icon: 'list',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']

      }
    },
    {
      path: 'apply-notice/:id/:status',
      component: () => import('@/views/audit/resident/apply-notice.vue'),
      name: 'ResidentApplyNotice',
      hidden: true,
      meta: {
        title: '提交材料',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']

      }
    },
    {
      path: 'apply-notice-read/:id/:status',
      component: () => import('@/views/audit/resident/apply-notice-read.vue'),
      name: 'ResidentNoticeRead',
      hidden: true,
      meta: {
        title: '公示材料',
        roles: ['ROLE_RESIDENT']

      }
    },
    {
      path: 'bonus',
      component: () => import('@/views/common/bonus.vue'),
      name: 'ResidentBonus',
      hidden: true,
      meta: {
        title: '补贴查看',
        roles: ['ROLE_RESIDENT', 'ROLE_PRINCIPAL']

      }
    }
  ]
}

export default residentRouter
