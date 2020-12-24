/*
 * @Author: zfd
 * @Date: 2020-11-11 10:16:09
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-24 09:19:40
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
      handler: function (route) {
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
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(async () => {
            const { roles } = await this.$store.dispatch('user/getInfo').catch(err => {
              console.log(err)
              this.$message.error(err)
            })
            if(!roles) {
              this.$router.push('/login') // 无权限返回登录界面
            }
            resetRouter() // 重置下路由，避免重复路由
            const accessRoutes = await this.$store.dispatch('permission/generateRoutes', roles)
            // dynamically add accessible routes
            // repair the problem of '/' not found, must place 404 at the end
            // ROLE_STREET ---> string
            let roleHome = roles[0].split('_').slice(1).join('-').toLocaleLowerCase()
            const unions = ['capital-rule', 'house-construction', 'urban-management', 'market-supervisor']
            if (unions.includes(roleHome)) {
              roleHome = 'union'
            }
            accessRoutes.splice(accessRoutes.length - 1, 0, { path: '/', redirect: '/' + roleHome, hidden: true })
            this.$router.addRoutes(accessRoutes)
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          })
            .catch(async (err) => {
              await this.$store.dispatch('user/resetToken')
              console.log(err)
              this.$message.error(err)
              this.loading = false
            })
        } else {
          this.$message.error('请输入正确的用户名密码')
          return false
        }
      })
    }
  }
}
