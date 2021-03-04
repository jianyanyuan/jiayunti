/*
 * @Author: zfd
 * @Date: 2020-12-04 10:50:09
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 13:09:35
 * @Description: 动态渲染业务流程
 */

/**
* 根据用户信息，工程信息生成按钮操作
* operations
* - project.state.operations
* userInfo:
*  - roles
* projectInfo:
*  - id
*  - status
*  - isSelf
*  - isPass
*/
export const createButtons = (operations, userInfo, projectInfo) => {
  if (!operations || !userInfo.roles || !projectInfo) {
    return null
  }
  let { roles } = userInfo
  const { id, status, isDelegated, isPass } = projectInfo
  if (roles[0] === 'ROLE_RESIDENT' && !isDelegated) {
    roles = ['ROLE_PRINCIPAL'] // 自行提交
  }
  // const roles = isDelegated === true ? ['ROLE_PRINCIPAL'] : ['ROLE_RESIDENT']// ROLE_PRINCIPAL 委托提交材料
  const buttons = []
  if (!roles || status === undefined || id === undefined) {
    return null
  }

  for (const operation of (operations[status] || [])) {
    if (operation.r.includes(roles[0]) && operation.status === isPass) {
      const { uN, o, s, t } = operation
      const url = { name: uN, params: { id, status }}
      buttons.push({ o, s, t, url })
    }
  }
  return buttons
}
export default {
  data() {
    return {}
  },
  methods: {
    getButtons(row) {
      const { id, statusId, isEntrust, whetherThrough } = row
      const userInfo = {
        roles: this.$store.getters.roles
      }
      const projectInfo = {
        id,
        status: statusId,
        isDelegated: isEntrust === 0, // 0委托
        isPass: whetherThrough === 0 ? undefined : whetherThrough
      }
      return createButtons(this.$store.state.project.operations, userInfo, projectInfo) || []
    }
  }
}
