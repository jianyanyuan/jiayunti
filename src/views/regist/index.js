/*
 * @Author: zfd
 * @Date: 2020-11-10 08:42:48
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-01 15:48:32
 * @Description:
 */
import * as Validator from '@/utils/element-validator'
import { mapGetters } from 'vuex'
import { checkType, notEmptyArray } from '@/utils'

function validateAddress(address) {
  if (checkType(address) !== 'Object') {
    return '请选择地址'
  }
  if (!notEmptyArray(address.county)) {
    return '请选择区县'
  }
  if (!notEmptyArray(address.community)) {
    return '请选择社区'
  }
  return true
}

const data = {
  form: {
    username: 'regist',
    password: '123456',
    // name: '张飞达',
    idcard: '321323199802254916',
    address: { county: [], community: [] },
    phonenumber: '13776050390',
    verificationcode: ''
  },
  rule: {
    username: [{ required: true, trigger: 'blur', validator: Validator.validateUsername }],
    password: [{ required: true, trigger: 'blur', validator: Validator.validatePassword }],
    // name: [{ required: true, trigger: 'blur', validator: Validator.validateTrueName }],
    idcard: [{ required: true, trigger: 'blur', validator: Validator.validateIdCard }],
    phonenumber: [{ required: true, trigger: 'blur', validator: Validator.validatePhone }],
    address: [{ required: true }],
    verificationcode: [{ required: true, trigger: 'blur', validator: Validator.validateNumberCode, length: 6 }]
  },
  vertifyDisabled: false,
  countDown: 60,
  timer: null,
  loading: false,
  countyProps: {
    value: 'id',
    label: 'name',
    children: 'areas'
  },
  communityProps: {
    value: 'id',
    label: 'name',
    children: 'communities'
  },
  communityOptions: []
}
export default {
  name: 'Regist',
  data() {
    return data
  },
  computed: {
    communityShow() {
      if (this.form.address.county.length) {
        this.communityOptions = this.$store.getters['common/communityOptions'](this.form.address.county)
      }
      return this.form.address.county.length
    },
    ...mapGetters('common', ['countyOptions'])
  },
  created() {
    this.$store.dispatch('common/getAddress').catch(() => this.$message.error('地址获取失败'))
  },
  methods: {
    // 注册用户
    submit(formName) {
      this.$refs[formName].validate((success, err) => {
        if (success) {
          const validAddress = validateAddress(this.form.address)
          if (validAddress !== true) {
            this.$message.error(validAddress)
            return
          }
          this.form.address = this.form.address.county.concat(this.form.address.community)
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
          this.$message.error(Object.entries(err)[0][1][0].message)
        }
      })
    },
    // 验证码focus事件
    checkPhone() {
      if (!this.vertifyDisable) {
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
            this.$message.error('验证码获取失败')
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
