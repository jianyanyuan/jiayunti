/*
 * @Author: zfd
 * @Date: 2020-11-11 10:16:09
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-11 16:05:38
 * @Description:
 */
import { validateUsername, validatePassword } from '@/utils/element-validator'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'regist',
        password: '123456'
      },
      loginRules: {
        // validator: validateUsername
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        // username: [{ required: true, trigger: 'blur' }],
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
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(async() => {
            const { roles } = await this.$store.dispatch('user/getInfo')
            const accessRoutes = await this.$store.dispatch('permission/generateRoutes', roles)
            // dynamically add accessible routes
            // repair the problem of '/' not found, must place 404 at the end
            // ROLE_STREET ---> string
            const roleHome = roles[0].split('_').slice(1).join('-').toLocaleLowerCase()
            accessRoutes.splice(accessRoutes.length - 1, 0, { path: '/', redirect: '/' + roleHome, hidden: true })

            this.$router.addRoutes(accessRoutes)
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch((err) => {
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
