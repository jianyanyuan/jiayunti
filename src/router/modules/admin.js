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

const adminRouter = {
  path: '/admin',
  component: Layout,
  redirect: '/resident/list',
  hidden: true,
  meta: {
    roles: ['ROLE_ADMIN']
  }
}

export default adminRouter
