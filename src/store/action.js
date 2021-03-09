/*
 * @Author: zfd
 * @Date: 2020-12-08 14:36:19
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 12:02:37
 * @Description:
 */

import { detailApi } from '@/api/projects'
import { parseTime } from '@/filters'
// 公众方法
const actions = {
  // 获取工程基本信息（纯展示）
  getProjectBasic(context, projectId) {
    return new Promise((resolve, reject) => {
      context.dispatch('common/getAddress').then(() => {
        detailApi(projectId).then(res => {
          console.log(context)
          debugger
          context.state.project.isDelegated = false
          const basic = Object.assign({}, res)
          const { deviceName, deviceType, residentialQuarters, building, unit, address, createTime, isEntrust } = res
          basic.createTime = parseTime(new Date(createTime), '{y}-{m}-{d} {h}:{i}')
          basic.address = address || context.getters.addressPlain
          basic.location = `${residentialQuarters}小区${building}幢${unit}单元`
          if (deviceName && deviceType) {
            basic.device = `${deviceName}/${deviceType}kg`
          } else {
            basic.device = ''
          }
          basic.isDelegated = false
          if (context.getters.roles[0] === 'ROLE_RESIDENT' && isEntrust === 0) {
            basic.isDelegated = true
            context.state.project.isDelegated = true
          }
          resolve(basic)
        }).catch(() => {
          reject({})
        })
      })
    })
  }
}

export default actions
