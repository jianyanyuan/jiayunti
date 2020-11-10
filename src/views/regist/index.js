/*
 * @Author: zfd
 * @Date: 2020-11-10 08:42:48
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-10 15:00:24
 * @Description:
 */
import * as Validator from '@/utils/element-validator'
import { mapGetters } from 'vuex'
import User from '@/api/user'
import { checkType, checkEmptyArray } from '@/utils'

function validateAddress(rule, address, callback) {
  if (checkType(address) !== 'Object') {
    callback(new Error('请选择地址'))
    return false
  }
  if (checkEmptyArray(address.county)) {
    callback(new Error('请选择区县'))
    return false
  }
  if (checkEmptyArray(address.community)) {
    callback(new Error('请选择社区'))
    return false
  }
  callback()
}

const data = {
  form: {
    username: 'zfd',
    password: '123456',
    // name: '张飞达',
    idcard: '321323199802254916',
    address: { county: [], community: [] },
    phonenumber: '15988800323',
    verificationcode: '1234'
  },
  rule: {
    username: [{ required: true, trigger: 'blur', validator: Validator.validateUsername }],
    password: [{ required: true, trigger: 'blur', validator: Validator.validatePassword }],
    // name: [{ required: true, trigger: 'blur', validator: Validator.validateTrueName }],
    idcard: [{ required: true, trigger: 'blur', validator: Validator.validateIdCard }],
    phonenumber: [{ required: true, trigger: 'blur', validator: validateAddress }],
    address: [{ required: true, trigger: 'blur', message: '请选择地址' }],
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
  data() {
    return data
  },
  computed: {
    communityShow() {
      if (this.form.address.county.length) {
        this.communityOptions = this.$store.getters.common.communityOptions(this.form.address.county)
      }
      return this.form.address.county.length
    },
    ...mapGetters('common', ['countyOptions'])
  },
  created() {

  },
  methods: {
    // 注册用户
    submit(formName) {
      this.$refs[formName].validate((success, err) => {
        if (success) {
          this.form.address = this.form.address.county.concat(this.form.address.community)
          this.loading = true
          this.$store.dispatch('user/regist', this.form).then(res => {
            this.loading = false
            this.$router.push('/login')
          }).catch(err => {
            this.$message.error(err)
            this.loading = false
          })
        } else {
          console.log(err)
          // this.$message.error('请补全注册信息')
        }
      })
      User.regist({
        address: ['12'],
        idcard: '111',
        password: '1111',
        phonenumber: '111',
        username: '1111',
        verificationcode: '111'
      }).then(res => this.$message.success(res))
        .catch(err => this.$message.error(err))
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
          .then(res => { this.form.verificationcode = res })
          .catch(err => this.$message.error(err))

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
