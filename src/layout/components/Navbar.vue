<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          {{ username }}
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->

          <el-dropdown-item @click.native="modifyVisible = true">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog v-el-drag-dialog title="修改密码" class="card-dialog" center :visible.sync="modifyVisible" append-to-body :close-on-click-modal="false" width="500px" @close="resetFrom('form')">
      <el-form ref="form" :model="form" :rules="rule" label-position="top">
        <el-form-item prop="originalPwd" label="原密码">
          <el-input v-model="form.originalPwd" type="password" placeholder="请输入原密码" />
        </el-form-item>
        <el-form-item prop="newPwd" label="新密码">
          <el-input v-model="form.newPwd" type="password" placeholder="请输入6-17位密码" @blur="setRule" />
        </el-form-item>
        <el-form-item prop="confirmPwd" label="确认密码">
          <el-input v-model="form.confirmPwd" type="password" placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item style="text-align:center;margin-top:40px">
          <el-button type="primary" :loading="loading" size="medium" @click="postReset('form')">修 改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { validatePassword, validateConfirmPassword } from '@/utils/element-validator'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      modifyVisible: false,
      form: {
        originalPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      rule: {
        originalPwd: [{ required: true, trigger: 'blur', message: '请输入原密码' }],
        confirmPwd: [{ required: true, trigger: 'blur', message: '两次密码不一致', validator: validateConfirmPassword }],
        newPwd: [{ required: true, trigger: 'blur', message: '密码需为6-17位数字和英文符号组合', validator: validatePassword }]
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'username'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)

      this.$router.push('/login')
    },
    resetFrom(formName) {
      this.$refs[formName].clearValidate()
    },
    // 修改密码
    postReset(formName) {
      this.$refs[formName].validate((success, errors) => {
        if (success) {
          this.loading = true
          this.$store.dispatch('user/modifyPwd', this.form).then((res) => {
            this.$message.success(res)
            setTimeout(() => {
              this.loading = false
              this.$message.warning('请重新登录')
              this.logout()
            }, 1000)
          }).catch(err => {
            this.$message.error(err)
            this.loading = false
          })
        } else {
          this.$message.error(Object.values(errors)[0][0].message)
        }
      })
    },
    setRule() {
      this.rule.confirmPwd[0].pwd = this.form.newPwd
    }
  }
}
</script>

<style scoped lang="scss" >
.card-dialog ::v-deep .el-dialog--center .el-dialog__body{
      padding-bottom: 10px;
    }
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 40px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .card-dialog{
    box-shadow: 0 12px 0 #000;

  }

}
</style>
