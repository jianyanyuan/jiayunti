/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-24 09:09:51
 * @Description:
 */
import router, { resetRouter } from './router'

import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/regist', '/reset-password'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = Array.isArray(store.getters.roles) && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          resetRouter()
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const userInfo = await store.dispatch('user/getInfo')
          // generate accessible routes map based on roles
          const roles = userInfo.roles
          if (!roles) {
            throw new Error('用户无权限')
          }
          // 获取流程节点、用户操作
          await store.dispatch('project/getApplyStatus')
          await store.dispatch('user/getOperation', { district: userInfo.address[1], role: roles[0], setState: true })
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          let roleHome = roles[0].split('_').slice(1).join('-').toLocaleLowerCase()
          // 居民和受理委托人共用一个路由表
          roleHome = roleHome === 'principal' ? 'resident' : roleHome
          const unions = ['capital-rule', 'house-construction', 'urban-management', 'market-supervisor']
          if (unions.includes(roleHome)) {
            roleHome = 'union'
          }
          accessRoutes.splice(accessRoutes.length - 1, 0, { path: '/', redirect: '/' + roleHome, hidden: true })

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
