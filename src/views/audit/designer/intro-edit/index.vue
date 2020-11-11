<!--
 * @Author: zfd
 * @Date: 2020-10-28 13:42:09
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-29 15:33:50
 * @Description: 设计单位介绍
-->
<template>
  <div>
    <!-- <div class="preview" v-html="msg" /> -->
    <el-form :model="designer" :rules="rule" label-width="120px" label-position="top" class="handle-form">
      <el-form-item label="公司名称:" prop="name">
        <el-input v-model="designer.name" />
      </el-form-item>
      <el-form-item label="公司地址:" prop="address">
        <el-input v-model="designer.address" />
      </el-form-item>
      <el-form-item label="联系方式:" prop="phone">
        <el-input v-model="designer.phone" />
      </el-form-item>
      <el-form-item label="文章来源:" prop="source">
        <el-input v-model="designer.source" />
      </el-form-item>
      <el-form-item label="作者:" prop="author">
        <el-input v-model="designer.author" />
      </el-form-item>
      <el-form-item label="官网链接:">
        <el-input v-model="designer.link" />
      </el-form-item>
      <el-form-item label="公司介绍:" prop="desc">
        <vue-ueditor-wrap :key="1" v-model="designer.desc" :config="myConfig" editor-id="editor_one" :destroy="true" />
      </el-form-item>
      <el-row type="flex" justify="center" style="margin:50px 0">
        <el-button @click="$router.push({name:'DesignerIntro',params:{designer}})">
          预 览
        </el-button>
        <el-button type="primary">保 存</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import VueUeditorWrap from '@/components/VueUeditor'

export default {
  name: 'IntroEdit',
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      designer: {
        name: '',
        source: '',
        link: '',
        author: '',
        desc: '',
        address: '',
        phone: ''
      },
      rule: {
        name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        source: [{ required: true, message: '请输入文章来源', trigger: 'blur' }],
        author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入公司简介', trigger: 'blur' }],
        address: [{ required: true, message: '请输入公司简介', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入公司简介', trigger: 'blur' }]

      },
      myConfig: {
        autoHeightEnabled: false,
        initialFrameHeight: 400,
        initialFrameWidth: '100%',
        UEDITOR_HOME_URL: '/UEditor/',
        serverUrl: 'http://35.201.165.105:8000/controller.php',
        enableAutoSave: false // 开启从草稿箱恢复功能需要手动设置固定的 editorId，否则组件会默认随机一个，如果页面刷新，下次渲染的时候 editorId 会重新随机，导致无法加载草稿箱数据
      }
    }
  },
  methods: {}
}
</script>

<style>
.preview{
  min-height: 200px;
  width: 100%;
}
.handle-form {
  width: 820px;
  margin: 50px auto 0;
}
</style>
