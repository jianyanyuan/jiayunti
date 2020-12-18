/*
 * @Author: zfd
 * @Date: 2020-11-10 08:42:48
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-18 15:36:12
 * @Description:
 */
import {validatePassword,validatePhone,validateNumberCode} from '@/utils/element-validator'

const data = {
  form: {
    password: '',
    phone: '',
    otp: ''
  },
  rule: {
    password: [{ required: true, trigger: 'blur',message:'密码需为6-17位数字和英文符号组合', validator: validatePassword }],
    phone: [{ required: true, trigger: 'blur',message:'请输入手机号',  validator: validatePhone }],
    otp: [{ required: true, trigger: 'blur',message:'验证码为6位纯数字', validator: validateNumberCode, length: 6 }]
  },
  vertifyDisabled: false,
  countDown: 60,
  timer: null,
  loading: false,
}
export default {
  name: 'Reset',
  data() {
    return data
  },
  created() {
  },
  methods: {
    // 重置密码
    postReset(formName) {
      this.$refs[formName].validate((success, err) => {
        if (success) {
          this.loading = true
          this.$store.dispatch('user/regist', this.form).then(() => {
            this.$message.success('注册成功')
            setTimeout(() => {
              this.loading = false
              this.$router.push('/login')
            }, 2000)
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
          if (this.countDown > 0 && this.timer) {
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
