<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-24 08:54:12
 * @Description: 其他材料
-->
<template>
  <div v-loading="pageLoading">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>其他材料</span>
      <template v-if="!$store.state.project.isDelegated">
        <el-button v-if="hasChanged" type="primary" style="float:right" @click="hasChanged = false">修改</el-button>
        <el-button v-else type="success" style="float:right" @click="handlePreview">预览</el-button>
      </template>
    </el-row>
    <template v-if="!$store.state.project.isDelegated && !hasChanged">
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
    <template v-else>
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>查看</span>
        </div>
        <upload-list :files="fileList" list-type="picture-card" :disabled="true" />

      </el-card>
    </template>

    <div style="text-align:center">
      <el-button type="primary" icon="el-icon-arrow-left" @click.native.prevent="nextProcess(-1)">上一步</el-button>
      <el-button v-if="!$store.state.project.isDelegated" type="success" icon="el-icon-upload2" @click.native.prevent="submitApply">提交申请</el-button>
    </div>
  </div>
</template>

<script>
import { advanceApi } from '@/api/projects'
import mixin from '@/mixin/upload-show'
export default {
  name: 'ApplyOthers',
  mixins: [mixin],
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      typeName: 'others-form'
    }
  },
  methods: {
    submitApply() {
      advanceApi(this.id, 0)
        .then(() => {
          // 回到我的申请
          this.$router.push('/resident/list')
        })
        .catch(() => {
          this.$message.error('申请提交失败')
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
