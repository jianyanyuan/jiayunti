<!--
 * @Author: zfd
 * @Date: 2020-10-28 13:42:09
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-30 13:32:36
 * @Description: 设计单位介绍
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <!-- <div class="preview" v-html="msg" /> -->
    <el-form ref="form" :model="org" :rules="rule" label-width="120px" label-position="top" class="handle-form">
      <el-form-item label="单位名称:" prop="companyName">
        <el-input v-model="org.companyName" />
      </el-form-item>
      <el-form-item label="单位地址:" prop="address">
        <el-input v-model="org.address" />
      </el-form-item>
      <el-form-item label="联系方式:" prop="phone">
        <el-input v-model="org.phone" />
      </el-form-item>
      <el-form-item label="文章来源:" prop="articleSource">
        <el-input v-model="org.articleSource" />
      </el-form-item>
      <el-form-item label="作者:" prop="author">
        <el-input v-model="org.author" />
      </el-form-item>
      <el-form-item label="官网链接:">
        <el-input v-model="org.link" />
      </el-form-item>
      <el-form-item label="公司介绍:" prop="introduction">
        <vue-ueditor-wrap :key="1" v-model="org.introduction" :config="myConfig" editor-id="editor_one" :destroy="true" />
      </el-form-item>
      <el-row type="flex" justify="center" style="margin:50px 0">
        <el-button @click="clickView">
          预 览
        </el-button>
        <el-button type="success" @click="handlePost">保 存</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import VueUeditorWrap from '@/components/VueUeditor'
import { validatePhone } from '@/utils/element-validator'
import Common from '@/api/common'
export default {
  name: 'IntroEdit',
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      org: {
        companyName: this.$store.getters.username,
        articleSource: '',
        link: '',
        author: '',
        introduction: '的萨大萨达',
        address: '滨河路1979号',
        phone: '15988800323'
      },
      pageLoading: false,
      type: 0,
      rule: {
        companyName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
        // source: [{ required: true, message: '请输入文章来源', trigger: 'blur' }],
        // author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        introduction: [{ required: true, message: '请输入单位简介', trigger: 'blur' }],
        address: [{ required: true, message: '请输入单位地址', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', validator: validatePhone, trigger: 'blur' }]

      },
      // 4、根据项目需求自行配置,具体配置参见ueditor.config.js源码或 http://fex.baidu.com/ueditor/#start-start

      myConfig: {
        autoHeightEnabled: false,
        initialFrameHeight: 400,
        initialFrameWidth: '100%',
        UEDITOR_HOME_URL: '/UEditor/',
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        serverUrl: 'http://192.168.0.191:8342/api/file/uploadImage',
                // 

        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        // UEDITOR_HOME_URL: '/static/UEditor/'
        // 配合最新编译的资源文件，你可以实现添加自定义Request Headers,详情https://github.com/HaoChuan9421/ueditor/commits/dev-1.4.3.3
        headers: {
          Authorization: this.$store.getters.token
        },
        enableAutoSave: false // 开启从草稿箱恢复功能需要手动设置固定的 editorId，否则组件会默认随机一个，如果页面刷新，下次渲染的时候 editorId 会重新随机，导致无法加载草稿箱数据
      }
    }
  },
  created() {
    const { type } = this.$route.query
    this.type = type
  },
  methods: {

    clickView() {
      const reg = /\/(.*)\//
      const prefix = this.$route.fullPath.match(reg)[1]
      const path = `/${prefix}/introduction`
      this.$router.push({ path, params: { detail: this.org } })
    },
    goView() {
      const reg = /\/(.*)\//
      const prefix = this.$route.fullPath.match(reg)[1]
      const path = `/${prefix}/introduction`
      this.$router.push({ path, params: { detail: this.org } })
    },
    handlePost() {
      this.$refs.form.validate(async (success, errors) => {
        if (success) {
          this.pageLoading = true
          if (this.type === 0) {
            // 修改
            await Common.modifyArticle(this.org)
              .catch(() => {
                this.$message.error('修改失败')
              })
          } else {
            await Common.addArticle(this.org)
              .catch(() => {
                this.$message.error('保存失败')
              })
          }
          this.goView()
          this.pageLoading = false
        } else {
          console.log(errors)
        }
      })
    }
  }
}
</script>

<style>
.preview {
  min-height: 200px;
  width: 100%;
}
.handle-form {
  width: 820px;
  margin: 50px auto 0;
}
</style>
