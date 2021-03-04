/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:14
 * @LastEditTime: 2020-12-30 10:06:29
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
    icon: 'construction',
    mean: 'user',
    roles: ['ROLE_CONSTRUCTION']
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/implement/construction/list/index.vue'),
      name: 'ConstructionList',
      meta: {
        title: '申请列表',
        icon: 'list',
        roles: ['ROLE_CONSTRUCTION']
      }
    },
    // {
    //   path: 'process/:id/:status',
    //   component: () => import('@/views/implement/construction/process/index.vue'),
    //   name: 'ConstructionProcess',
    //   hidden: true,
    //   meta: {
    //     title: '报价',
    //     roles: [ 'ROLE_CONSTRUCTION']
    //   }
    // },
    // {
    //   path: 'offer-list',
    //   component: () => import('@/views/implement/construction/offer-list/list.vue'),
    //   name: 'ConstructionOfferList',
    //   meta: {
    //     title: '已报价列表',
    //     icon: 'list',
    //     roles: [ 'ROLE_CONSTRUCTION']
    //   }
    // },
    // {
    //   path: 'offer-detail/:id/:status',
    //   component: () => import('@/views/implement/construction/offer-list/detail.vue'),
    //   name: 'ConstructionOfferDetail',
    //   hidden: true,
    //   meta: {
    //     title: '报价详情',
    //     roles: [ 'ROLE_CONSTRUCTION']
    //   }
    // },
    {
      path: 'fault/:id/:status',
      name: 'ConstructionFault',
      component: () => import('@/views/implement/construction/fault/index.vue'),
      hidden: true,
      meta: {
        title: '违规',
        roles: ['ROLE_CONSTRUCTION']
      }
    },
    {
      path: 'complete',
      name: 'ConstructionComplete',
      component: () => import('@/views/implement/construction/complete/index.vue'),
      hidden: true,
      meta: {
        title: '竣工验收',
        roles: ['ROLE_CONSTRUCTION']
      }
    },
    {
      path: 'intro_edit',
      component: () => import('@/views/common/introduction/edit.vue'), // Parent router-view
      name: 'ConIntroEdit',
      hidden: true,
      meta: {
        title: '编辑',
        icon: 'edit',
        roles: ['ROLE_CONSTRUCTION']
      }
    },
    {
      path: 'introduction',
      component: () => import('@/views/common/introduction/view.vue'), // Parent router-view
      name: 'ConIntro',
      // hidden: true,
      meta: {
        title: '公司介绍',
        icon: 'eye',
        roles: ['ROLE_CONSTRUCTION']
      }
    }
  ]
}

export default constructionRouter
