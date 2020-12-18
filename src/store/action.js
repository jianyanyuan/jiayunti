/*
 * @Author: zfd
 * @Date: 2020-12-08 14:36:19
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-09 17:30:34
 * @Description: 
 */

import Project from '@/api/projects'
import { parseTime } from '@/filters'
// 公众方法
const actions = {
  // 获取工程基本信息（纯展示）
  getProjectBasic(context,projectId) {
    return new Promise(async(resolve, reject) => {
      await context.dispatch('common/getAddress')
      Project.detail(projectId).then(res => {
        const basic = {}
        const { applicantName, phoneNumber, designName, deviceName, deviceType, rooms, residentialQuarters, building, unit,address,createTime } = res
        basic.applicantName = applicantName
        basic.createTime =  parseTime(new Date(createTime),'{y}-{m}-{d} {h}:{i}')
        basic.address = address || context.getters.addressPlain
        basic.phoneNumber = phoneNumber
        basic.location = `${residentialQuarters}小区${building}幢${unit}单元`
        basic.designName = designName
        basic.device = `${deviceName}/${deviceType}kg`
        basic.rooms = rooms
        resolve(basic)
      }).catch(err => {
        console.log(err)
        reject({})
      })
    })
  }
}

export default actions