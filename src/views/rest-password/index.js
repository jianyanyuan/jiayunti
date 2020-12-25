/*
 * @Author: zfd
 * @Date: 2020-11-10 08:42:48
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-25 16:17:11
 * @Description:
 */
import {validatePassword,validatePhone,validateNumberCode} from '@/utils/element-validator'

export default {
  name: 'Reset',
  data() {
    return {
      form: {
        password: '',
        phonenumber: '',
        verificationcode: ''
      },
      rule: {
        password: [{ required: true, trigger: 'blur',message:'密码需为6-17位数字和英文符号组合', validator: validatePassword }],
        phonenumber: [{ required: true, trigger: 'blur',message:'请输入手机号',  validator: validatePhone }],
        verificationcode: [{ required: true, trigger: 'blur',message:'验证码为6位纯数字', validator: validateNumberCode, length: 6 }]
      },
      vertifyDisabled: false,
      countDown: 60,
      timer: null,
      loading: false,
    }
  },
  created() {
  },
  methods: {
    // 重置密码
    postReset(formName) {
      this.$refs[formName].validate((success, err) => {
        if (success) {
          this.loading = true
          this.$store.dispatch('user/findPwd', this.form).then((res) => {
            this.$message.success(res)
            setTimeout(() => {
              this.loading = false
              this.$router.push('/login')
            }, 1000)
          }).catch(err => {
            this.$message.error(err)
            this.loading = false
          })
        } else {
          this.$message.error('请补全信息')
        }
      })
    },
    // 验证码focus事件
    checkPhone() {
      if (!this.vertifyDisabled) {
        this.$message.error('请先获取验证码')
      }
    },
    // 获取验证码
    getVertification() {
      const reg = /^1[3456789]\d{9}$/
      if (this.form.phonenumber && reg.test(this.form.phonenumber)) {
        this.vertifyDisabled = true
        this.$store.dispatch('user/getCode', { role: this.form.phonenumber })
          .catch((err) => {
            console.log(err)
            this.$message.error('验证码获取失败,请稍后重试')
          })

        this.timer = setInterval(() => {
          if (this.countDown >= 0 && this.timer) {
            this.countDown--
          } else {
            clearInterval(this.timer)
            this.timer = null
            this.vertifyDisabled = false
          }
        }, 1000)
      } else {
        this.$message.error('请先输入手机号')
      }
    }
    

  }
}
