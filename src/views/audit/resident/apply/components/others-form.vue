<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-16 15:43:07
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
      <el-card class="upload-card-public gap-bottom-public">
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
      <el-card class="upload-card-public">
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
      advanceApi(this.id, window.sessionStorage.getItem('oid'))
        .then(() => {
          // 回到我的申请
          this.$router.push('/resident/list')
        })
        .catch((errMsg) => {
          this.$message.error(errMsg)
        })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
