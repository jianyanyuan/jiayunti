/*
 * @Author: zfd
 * @Date: 2020-10-15 16:32:36
 * @LastEditTime: 2020-12-22 10:41:29
 * @LastEditors: zfd
 * @Description: 审批端设计路由表
 * @FilePath: \jiayunti\src\router\modules\audit\resident.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'
import Empty from '@/layout/empty.vue'
const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: '/admin/setting',
  name: 'Admin',
  meta: {
    title: '网站管理员',
    mean: 'user',
    roles: ['ROLE_ADMIN']
  },
  children: [
    {
      path: 'setting',
      component: () => import('@/views/admin/setting.vue'), // Parent router-view
      name: 'AdminSetting',
      meta: {
        title: '流程操作配置',
        icon: 'flow',
        roles: ['ROLE_ADMIN']
      }
    },
    {
      path: 'node',
      component: () => import('@/views/admin/node.vue'), // Parent router-view
      name: 'AdminNode',
      meta: {
        title: '节点设置',
        icon: 'node',
        roles: ['ROLE_ADMIN']
      }
    },
    {
      path: 'region',
      component: () => import('@/views/admin/region.vue'), // Parent router-view
      name: 'AdminRegion',
      meta: {
        title: '行政区域变更',
        icon: 'area',
        roles: ['ROLE_ADMIN']
      }
    },
    {
      path: 'audit',
      component: () => import('@/views/admin/audit.vue'), // Parent router-view
      name: 'AdminAudit',
      meta: {
        title: '企业初审',
        icon: 'check',

        roles: ['ROLE_ADMIN']
      }
    },
    {
      path: 'audit-detail/:type/:id',
      component: () => import('@/views/admin/audit-detail.vue'), // Parent router-view
      name: 'AdminAuditDetail',
      hidden: true,
      meta: {
        title: '企业简介',
        roles: ['ROLE_ADMIN']
      }
    },
    {
      path: 'resources',
      component: Empty,
      redirect: '/admin/resources/manage',
      name: 'AdminResources',
      meta: {
        title: '平台资源',
        icon: 'resource',
        roles: ['ROLE_ADMIN']
      },
      children: [
        {
          path: 'manage',
          component: () => import('@/views/admin/resources.vue'),
          name: 'AdminResourcesManage',
          meta: {
            title: '资源管理',
            icon: 'manage',
            roles: ['ROLE_ADMIN']
          }
        },
        {
          path: 'device-list',
          component: () => import('@/views/audit/resident/device-list.vue'),
          name: 'AdminDevice',
          meta: {
            title: '设备列表',
            icon: 'device',
            roles: ['ROLE_ADMIN']
          }
        },
        {
          path: 'designer-list',
          component: () => import('@/views/audit/resident/designer-list.vue'),
          name: 'ResidentDesigner',
          meta: {
            title: '设计单位',
            icon: 'design',
            roles: ['ROLE_ADMIN']
          }
        },
        {
          path: 'construction-list',
          component: () => import('@/views/audit/resident/construction-list.vue'),
          name: 'ResidentConstruction',
          meta: {
            title: '施工单位',
            icon: 'construction',
            roles: ['ROLE_ADMIN']
          }
        },
        {
          path: 'supervisor-list',
          component: () => import('@/views/audit/resident/supervisor-list.vue'),
          name: 'ResidentSupervisor',
          meta: {
            title: '监理单位',
            icon: 'supervisor',
            roles: ['ROLE_ADMIN']
          }
        }

      ]
    }
  ]
}

export default adminRouter
