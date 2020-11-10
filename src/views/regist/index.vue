<template>
  <div>
    <div class="regist-head">居民注册</div>
    <el-card class="regist-main">
      <el-row type="flex" class="row-bg">
        <el-col :span="16">
          <el-form ref="form" :model="form" :rules="rule" class="regist-form" label-position="top">
            <el-form-item prop="username" label="用户名">
              <el-input v-model="form.username" placeholder="请输入用户名" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="password" label="登录密码">
              <el-input v-model="form.password" type="password" autocomplete="off" placeholder="请输入6-12位密码" />
            </el-form-item>
            <!-- <el-form-item prop="name" label="姓名">
              <el-input v-model="form.name" placeholder="请输入真实姓名" autocomplete="off" />
            </el-form-item> -->
            <el-form-item prop="idcard" label="身份证">
              <el-input v-model="form.idcard" placeholder="请输入身份证" autocomplete="off" />
            </el-form-item>
            <el-form-item prop="address" label="地址">
              <el-cascader v-model="form.address.county" :options="addressOptions" :props="countyProps" />
              <label v-if="communityShow" for="address-detail" class="regist-address-d"> — </label>
              <el-cascader v-if="communityShow" v-model="form.address.community" :options="plotOptions" :props="communityProps" />
              <!-- <el-input v-model="form.address" placeholder="请选择地址" autocomplete="off" /> -->
            </el-form-item>
            <el-form-item prop="phonenumber" label="手机号">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item prop="verificationcode" label="验证码">
              <slot name="-">
                <el-input v-model="form.verificationcode" placeholder="请输入验证码" class="regist-vertify" @focus="checkPhone" />
                <div class="regist-vertify-g">
                  <el-button v-if="!vertifyDisabled" type="primary" @click="getVertification">获取验证码</el-button>
                  <span v-else>{{ countDown }} s后重试</span>
                </div>
              </slot>

            </el-form-item>
            <el-form-item style="text-align:center">
              <el-button type="success" :loading="loading" class="regist-submit" @click="submit('form')">注 册</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="8">
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
  background-color: #00acc1;
  font-size: 41px;
  letter-spacing: 4px;
  color: #fff;
  text-shadow: 1px 1px 6px #8c8585;
}
.regist-main {
  width: 1100px;
  position: absolute;
  left: 28%;
  top: 120px;
}
.regist-form {
  position: relative;
  left: 5%;
  width:500px;
}
.regist-address-d{
  margin:0 5px;
  color:#394867
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

.regist-login{
  color: #49a71b;
  &:hover{
    color: black;
  }
}

</style>
