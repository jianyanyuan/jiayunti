<template>
  <div class="regist-container">
    <div class="regist-head">居民注册</div>
    <el-card class="box-card">
      <el-row type="flex" class="row-bg">
        <el-col :span="16">
          <el-form ref="form" :model="form" :rules="rule" class="queryform" label-position="top">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="form.username" placeholder="请输入用户名" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="password" label="登录密码">
              <el-input v-model="form.password" type="password" autocomplete="off" placeholder="请设置密码（6-12位数字与字母组合）" />
            </el-form-item>
            <el-form-item prop="name" label="姓名">
              <el-input v-model="form.name" placeholder="请输入真实姓名" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="idCard" label="身份证">
              <el-input v-model="form.idCard" placeholder="请输入身份证" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="address" label="地址">
              <el-cascader v-model="address.city" :options="addressOptions" />
              <label v-show="unitShow" for="address-detail" class="label-detail"> — </label>
              <el-cascader v-show="unitShow" v-model="address.plot" :options="plotOptions" />
              <!-- <el-input v-model="form.address" placeholder="请选择地址" autocomplete="off" /> -->
            </el-form-item>
            <el-form-item prop="phone" label="手机号">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item prop="vertification" label="验证码">
              <slot name="-">
                <el-input v-model="form.vertification" placeholder="请输入验证码" class="vertification" @focus="checkPhone" />
                <div class="vertify-get">
                  <el-button v-show="!vertifyDisable" type="primary" @click="getVertification">获取验证码</el-button>

                  <span v-show="vertifyDisable" class="count-down">{{ countDown }} s后重试</span>
                </div>
              </slot>

            </el-form-item>
            <el-form-item style="text-align:center">
              <el-button type="primary" class="subform" @click="submit('form')">注 册</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
          <div class="right-list">
            <p>已有账户</p>
            <router-link to="/login" class="go-login">直接登录<i class="el-icon-right" /></router-link>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import * as Validator from '@/utils/element-validator'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      address: {
        city: [],
        plot: []
      },
      vertifyDisable: false,
      countDown: 60,
      timer: null,
      form: {
        username: 'zfd',
        password: '123456',
        name: '张飞达',
        idCard: '321323199802254916',
        address: 'xxx',
        phone: '15988800323',
        vertification: '1234'
      },
      rule: {
        username: [{ required: true, trigger: 'blur', validator: Validator.validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: Validator.validatePassword }],
        name: [{ required: true, trigger: 'blur', validator: Validator.validateTrueName }],
        idCard: [{ required: true, trigger: 'blur', validator: Validator.validateIdCard }],
        phone: [{ required: true, trigger: 'blur', validator: Validator.validatePhone }],
        address: [{ required: true, trigger: 'blur', message: '请选择地址' }],
        vertification: [{ required: true, trigger: 'blur', validator: Validator.validateNumberCode, length: 4 }]
      }
    }
  },
  computed: {
    unitShow() {
      return this.address.city.length
    },
    ...mapGetters('common', ['addressOptions', 'plotOptions'])
  },
  methods: {
    // 注册用户
    submit(formName) {
      this.$refs[formName].validate((success) => {
        if (success) {
          if (this.address.city.length === 0 || this.address.plot.length === 0) {
            this.$message.error('请选择地址')
            return false
          }
          this.form.address = this.address.city.concat(this.address.plot)
          console.log('注册')
        } else {
          this.$message.error('请补全注册信息')
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
      if (this.form.phone && reg.test(this.form.phone)) {
        this.vertifyDisable = true
        this.timer = setInterval(() => {
          if (this.countDown > 0 && this.timer) {
            this.countDown--
          } else {
            this.timer = null
            this.vertifyDisable = false
          }
        }, 1000)
      } else {
        this.$message.error('请输入手机号')
      }
    }
  }
}
</script>
<style scoped lang="scss">
.regist-head {
  text-align: center;
  line-height: 150px;
  height: 150px;
  background-color: #00acc1;
  font-size: 41px;
  letter-spacing: 4px;
  color: #fff;
  text-shadow: 1px 1px 6px #8c8585;
}
.subform {
  text-align: center;
  font-size: 18px;
  width: 400px;
}

.vertification {
  width: 310px;
  margin-right: 20px;
}

.box-card {
  width: 1100px;
  position: absolute;
  left: 28%;
  top: 120px;
}
.queryform {
  position: relative;
  left: 5%;
  width:500px;
}

.vertify-get {
  position: relative;
  top: -40px;
  left: 330px;
  width: 110px;
  height: 40px;
  border-radius: 10px;
  text-align: center;
  background-color: rgb(211, 209, 209);
}
.right-list {
  font-size: 16px;
  letter-spacing: 3px;
  color: #1b9dd9;
  position: relative;
  top: 20px;
  line-height: 25px;
  color: black;
}

.go-login{
  color: #49a71b;
  &:hover{
    color: black;
  }
}
.label-detail{
  margin:0 5px;
  color:#394867
}
</style>
