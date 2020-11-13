/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-13 10:27:29
 * @Description:
 */
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userid: state => state.user.id,
  username: state => state.user.username,
  phone: state => state.user.phone,
  address: state => state.user.address?.map(v => +v),
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
