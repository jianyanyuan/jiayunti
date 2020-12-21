<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-21 16:06:04
 * @Description: 施工档案归档、竣工验收
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>材料上传</span>
      <el-button type="success" style="float:right" @click="handlePost">提 交</el-button>
    </el-row>

    <el-card class="upload-card" style="margin-bottom:30px">
      <div slot="header">
        <span>档案归档</span>
      </div>
      <el-upload action="#"  :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,0)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,0)}" drag :auto-upload="false">
        <!-- <i class="el-icon-upload" /> -->
        <div>将文件拖到此处，或点击添加</div>
        <p>单个文件大小不超过20MB，可上传图片或PDF</p>
      </el-upload>
    </el-card>
    <el-card class="upload-card" style="margin-bottom:30px">
      <div slot="header">
        <span>竣工验收</span>
      </div>
      <el-upload action="#"  :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,1)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,1)}" drag :auto-upload="false">
        <!-- <i class="el-icon-upload" /> -->
        <div>将文件拖到此处，或点击添加</div>
        <p>单个文件大小不超过20MB，可上传图片或PDF</p>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
import File from '@/api/file'
import Project from '@/api/projects'
import { notEmptyArray, checkUpload } from '@/utils'
// import { deepClone } from '@/utils

export default {
  name: 'ApplyNotice',
  data() {
    return {
      // 修改后重新保存
      // formLoading: false,
      pageLoading: false,
      uploadList: [], // 上传用
      dirName: ['construction-record', 'construction-complete'],
      projectId: null, // 工程id
      status: null // 工程阶段标识位
    }
  },

  computed: {
  },
  watch: {

  },
  created() {
    const { id, status } = this.$route.params
    //3第二次提交材料
    if (!isNaN(+id) && status == 11) {
      this.projectId = id
      this.status = status
    }
  },
  methods: {


    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList, type) {
      const valid = checkUpload(file.raw)
      if (valid && file.status === 'ready') {
        const formData = new FormData()
        formData.append('file', file.raw)
        const upload = {
          type,
          uid: file.uid,
          file: formData
        }
        this.uploadList.push(upload)

      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList, type) {
      if (file.url === undefined) {
        // 未上传 --> 取消上传
        const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
        this.uploadList.splice(removeIdx, 1)

      }
    },

    // 保存修改
    async handlePost() {
      this.pageLoading = true
      let error = false
      if(this.uploadList.length === 0) {
        this.$message.error('请上传附件')
        return
      }
      this.uploadList.forEach(async (v, i) => {
        const { type, file } = v
        await File.upload(file, { typeName: this.dirName[type], projectId: this.projectId })
          .then(() => {
            this.uploadList.splice(i, 1)
          })
          .catch(() => {
            // 上传失败
            error = true
          })
      })
      if (error) {
        this.$message.error('保存失败，请重新保存')
        return
      }
      await Project.advance(this.projectId, this.status)
        .then(() => {
          this.$router.push('/construction/list')
        })
        .catch(() => {
          this.$message.error('流程错误')
        })
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    //3第二次提交材料
    const illegal = isNaN(+id) || status != 11

    if (illegal) {
      next('/redirect' + from.fullPath)
    }
    next()
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
