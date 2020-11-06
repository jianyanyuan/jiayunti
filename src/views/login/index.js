import { validateUsername, validatePassword } from '@/utils/element-validator'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        // validator: validateUsername
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
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
            if (Array.isArray(roles) && roles.length > 0) {
              accessRoutes.splice(accessRoutes.length - 1, 0, { path: '/', redirect: '/' + roles[0], hidden: true })
            }
            this.$router.addRoutes(accessRoutes)
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
