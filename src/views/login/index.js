/*
 * @Author: zfd
 * @Date: 2020-11-11 10:16:09
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 10:32:34
 * @Description:
 */
import { resetRouter } from '@/router'
import { validateUsername, validatePassword } from '@/utils/element-validator'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        // 用户名非数字开头，2-17位中英文和数字组合
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // 6-17位数字和英文符号组合
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid, errors) => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(async() => {
            const userInfo = await this.$store.dispatch('user/getInfo')
              .catch(err => {
                this.$message.error(err)
              })
            const roles = userInfo.roles
            if (!roles) {
              this.$router.push('/login') // 无权限返回登录界面
            }
            // 自由角色获取所有区的节点，区角色的有效节点
            const freeRoles = ['ROLE_ADMIN', 'ROLE_DESIGNER', 'ROLE_PRINCIPAL', 'ROLE_CONSTRUCTION', 'ROLE_DEVICE', 'ROLE_SUPERVISION']
            const district = freeRoles.includes(roles[0]) ? '' : userInfo.address[1]
            await this.$store.dispatch('project/getApplyStatus', district)

            await this.$store.dispatch('user/getOperation', { district, role: roles[0], setState: true })

            resetRouter() // 重置下路由，避免重复路由
            const accessRoutes = await this.$store.dispatch('permission/generateRoutes', roles)
            // dynamically add accessible routes
            // repair the problem of '/' not found, must place 404 at the end
            // ROLE_STREET ---> string
            let roleHome = roles[0].split('_').slice(1).join('-').toLocaleLowerCase()
            // 居民和受理委托人共用一个路由表
            roleHome = roleHome === 'principal' ? 'resident' : roleHome
            const unions = ['capital-rule', 'house-construction', 'urban-management', 'market-supervisor']
            if (unions.includes(roleHome)) {
              roleHome = 'union'
            }
            accessRoutes.splice(accessRoutes.length - 1, 0, { path: '/', redirect: '/' + roleHome, hidden: true })
            this.$router.addRoutes(accessRoutes)
            this.$router.push({ path: '/' })
            this.loading = false
          }).catch(async(errMsg) => {
            await this.$store.dispatch('user/resetToken')
            this.$message.error(errMsg)
            this.loading = false
          })
        } else {
          this.$message.error(Object.values(errors)[0][0].message)
          return false
        }
      })
    }
  }
}
