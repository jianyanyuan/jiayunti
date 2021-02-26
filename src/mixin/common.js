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
      const { uN, uP, o, s, t } = operation
      const url = uN ? { name: uN, params: { id, status }} : { path: uP, query: { id, status }}
      buttons.push({ o, s, t, url })
    }
  }
  return buttons
}
