/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-10 08:27:17
 * @Description:
 */
import { notEmptyArray } from '@/utils'
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userid: state => state.user.id,
  username: state => state.user.username,
  phone: state => state.user.phone,
  address: state => state.user.address?.map(v => +v),
  addressPlain: state => {
    let source = state.common.address
    if(!source) {
      return ''
    }
    const idxMap = new Map([[0, 'areas'], [1, 'streets'], [2, 'communities']])
    try {
      if (notEmptyArray(state.user.address)) {
        const result = state.user.address.reduce((init, value, index) => {
          const target = source.find(v => v.id == value)
          if(!target){
            throw new Error('数据异常')
          }
          source = target[idxMap.get(index)]
          return init.concat(target.name)
        }, [])
        return result.join('/')
      }
    }catch(err) {
      console.log(err)
      console.log('地址')
      return ''
    }
  },
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
