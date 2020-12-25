/*
 * @Author: zfd
 * @Date: 2020-11-10 08:42:48
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-25 16:24:47
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

export default {
  name: 'Regist',
  data() {
    return {
      form: {
        username: '',
        password: '',
        idcard: '',
        address: 'xxx',
        phonenumber: '',
        verificationcode: ''
      },
      address:{ county: [], community: [] },
      rule: {
        username: [{ required: true, trigger: 'blur',message:'用户名非数字开头，2-30位中英文和数字组合', validator: Validator.validateUsername }],
        password: [{ required: true, trigger: 'blur',message:'密码需为6-17位数字和英文符号组合', validator: Validator.validatePassword }],
        idcard: [{ required: true, trigger: 'blur',message:'请输入身份证号', validator: Validator.validateIdCard }],
        phonenumber: [{ required: true, trigger: 'blur',message:'请输入手机号', validator: Validator.validatePhone }],
        address: [{ required: true }],
        verificationcode: [{ required: true, trigger: 'blur', message:'验证码为6位纯数字',validator: Validator.validateNumberCode, length: 6 }]
      },
      vertifyDisabled: false,
      countDown: 60,
      timer: null,
      loading: false,
      communityShow:false,
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
  },
  computed: {
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
          const validAddress = validateAddress(this.address)
          if (validAddress !== true) {
            this.$message.error(validAddress)
            return
          }
          this.form.address = this.address.county.concat(this.address.community)
          this.loading = true
          this.$store.dispatch('user/regist', this.form).then(() => {
            this.$message.success('注册成功')
            setTimeout(() => {
              this.loading = false
              this.$router.push('/login')
            }, 1000)
          }).catch(err => {
            this.$message.error(err)
            this.loading = false
          })
        } else {
          this.$message.error('请补全注册信息')
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
    },
    changeAddress(newValue) {
      this.communityOptions = this.$store.getters['common/communityOptions'](newValue)
      this.communityShow = true
    },
    focusAddress() {
      this.communityShow = false
    }

  }
}
