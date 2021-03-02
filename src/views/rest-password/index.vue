<template>
  <div>
    <div class="regist-head">
      重置密码
    </div>
    <el-card class="regist-main">
      <el-row type="flex" class="row-bg">
        <el-col :span="17">
          <el-form ref="form" :model="form" :rules="rule" class="regist-form" label-position="top">
            <el-form-item prop="phonenumber" label="手机号">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item prop="verificationcode" label="验证码" class="regist-code-container">
              <el-input v-model="form.verificationcode" placeholder="请输入验证码" class="regist-vertify" @focus="checkPhone" />
              <div class="regist-vertify-g">
                <el-button v-if="!vertifyDisabled" type="primary" @click="getVertification">获取验证码</el-button>
                <span v-else>{{ countDown }} s后重试</span>
              </div>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
              <el-input v-model="form.password" type="password" placeholder="请输入6-12位密码" @blur="setRule" />
            </el-form-item>
            <el-form-item prop="conPwd" label="确认密码">
              <el-input v-model="form.conPwd" type="password" placeholder="请再次输入密码" />
            </el-form-item>
            <el-form-item style="text-align:center;margin-top:40px">
              <el-button type="success" :loading="loading" class="regist-submit" @click="postReset('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="7">
          <div class="regist-aside">
            <p>已有账户</p>
            <router-link to="/login" class="regist-login">直接登录<i class="el-icon-right" /></router-link>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import index from './index.js'

export default {
  ...index
}
</script>
<style scoped lang="scss">
.regist-head {
  text-align: center;
  line-height: 150px;
  height: 150px;
  font-size: 40px;
  letter-spacing: 4px;
  color: #fff;
  text-shadow: 1px 1px 6px #8c8585;
  background-color: #394867;
}
.regist-main {
  width: 900px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 220px;
}
.regist-form {
  position: relative;
  left: 5%;
  width: 500px;
}
.regist-address-d {
  margin: 0 5px;
  color: #394867;
}
.regist-code-container ::v-deep .el-form-item__content {
  height: 50px;
}
.regist-vertify {
  width: 310px;
  margin-right: 20px;
}
.regist-vertify-g {
  position: relative;
  top: -40px;
  left: 330px;
  width: 110px;
  height: 40px;
  border-radius: 10px;
  text-align: center;
  background-color: rgb(211, 209, 209);
}
.regist-submit {
  text-align: center;
  font-size: 18px;
  width: 400px;
}

.regist-aside {
  font-size: 16px;
  letter-spacing: 3px;
  color: #1b9dd9;
  position: relative;
  top: 20px;
  line-height: 25px;
  color: black;
}

.regist-login {
  color: #49a71b;
  &:hover {
    color: black;
  }
}
</style>
