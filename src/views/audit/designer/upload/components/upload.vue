<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-24 14:52:26
 * @Description: 设计院方案设计稿
-->
<template>
  <div v-loading="pageLoading">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>方案设计稿</span>
      <el-button v-if="hasChanged" type="primary" style="float:right" @click="hasChanged = !hasChanged">修改</el-button>
      <el-button v-else type="primary" style="float:right" @click="postApply(typeName)">保存</el-button>
    </el-row>
    <template v-if="hasChanged">
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>查看</span>
        </div>
        <upload-list :files="fileList" list-type="picture-card" :disabled="true" />

      </el-card>
    </template>

    <template v-else>
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>上传</span>
        </div>
        <el-upload action="#" :file-list="fileList" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList)}" drag :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
          <div>将文件拖到此处，或点击添加</div>
          <p>单个文件大小不超过20MB，可上传图片或PDF</p>
        </el-upload>
      </el-card>
    </template>
    <div style="text-align:center">
      <el-button type="primary" icon="el-icon-arrow-left" @click.native.prevent="nextProcess(-1)">上一步</el-button>
      <el-button v-if="hasChanged" type="success" icon="el-icon-arrow-right" @click.native.prevent="handlePost">提交</el-button>
    </div>
  </div>
</template>

<script>
import { advanceApi } from '@/api/projects'
import mixin from '@/mixin/upload-show'

export default {
  name: 'DesignerScheme',
  mixins: [mixin],
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      typeName: 'designer-scheme'
    }
  },
  methods: {
    handlePost() {
      this.pageLoading = true
      advanceApi(this.id, 2).then(() => {
        this.$router.push('/designer/list')
      }).catch(() => {
        this.$message.error('流程错误')
      })
        .finally(() => {
          this.pageLoading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
.upload-card ::v-deep .el-card__body {
  text-align: center;
  margin-bottom: 30px;
}
.enclosure-tips {
  color: #14274e;
  text-align: left;
  li {
    list-style: decimal;
  }
}
.upload-card ::v-deep .el-upload-dragger {
  width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
.image-container {
  height: 200px;
  margin-bottom: 20px;
  img {
    width: auto;
    height: auto;

    max-width: 100%;
    max-height: 100%;
  }
}
</style>
