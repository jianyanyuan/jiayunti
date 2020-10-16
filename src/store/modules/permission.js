/*
 * @Author: zfd
 * @Date: 2020-10-16 08:37:55
 * @LastEditTime: 2020-10-16 16:03:56
 * @LastEditors: zfd
 * @Description: router permission
 * @FilePath: \jiayunti\src\store\modules\permission.js
 */
import { asyncRoutes, constantRoutes } from '@/router'

/**
 * 判断角色路由
 * @param {array} roles
 * @param {object} route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 根据角色过滤异步路由
 * @param {array} routes asyncRoutes
 * @param {array} roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessRoutes
      if (roles.includes('admin')) {
        accessRoutes = asyncRoutes || []
      } else {
        accessRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessRoutes)
      resolve(accessRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
