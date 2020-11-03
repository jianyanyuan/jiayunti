/*
 * @Author: zfd
 * @Date: 2020-10-13 09:15:58
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-03 14:25:23
 * @Description: user mock
 */
const api_prefix_dev = '/api/user/'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  resident: {
    token: 'resident-token'
  },
  community: {
    token: 'community-token'
  },
  designer: {
    token: 'designer-token'
  },
  street: {
    token: 'street-token'
  },
  'drawing_audit': {
    token: 'drawing_audit-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'resident-token': {
    roles: ['resident'],
    introduction: 'I am an resident',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal resident'
  },
  'community-token': {
    roles: ['community'],
    introduction: 'I am an community',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal community'
  },
  'designer-token': {
    roles: ['designer'],
    introduction: 'I am an designer',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal designer'
  },
  'street-token': {
    roles: ['street'],
    introduction: 'I am an street',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal street'
  },
  'drawing_audit-token': {
    roles: ['drawing_audit'],
    introduction: 'I am an drawingAudit',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal drawingAudit'
  }
}

module.exports = [
  // user login
  {
    url: api_prefix_dev + 'login',
    type: 'post',
    response: config => {
      // const { username } = config.body
      const data = {
        token: 'Bearer eylMbctittit1.y tlr.bfrzrialtjoarjlyibo101511lAkilf2010NA12.61Ft-lulrj[10otNicir1s1aA1Vb&oNk2451lxkthor2hmbiE:1aNldanr2tb opeclcxcto',
        roleToken: tokens.admin.token
      }

      // mock error
      if (!data.token) {
        return {
          status: 401,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        status: 200,
        data
      }
    }
  },

  // get user info
  {
    url: api_prefix_dev + 'info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const data = users[token]

      // mock error
      if (!data) {
        return {
          status: 500,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        status: 200,
        data
      }
    }
  },

  // user logout
  {
    url: api_prefix_dev + 'logout',
    type: 'post',
    response: _ => {
      return {
        status: 200,
        data: 'success'
      }
    }
  }
]
