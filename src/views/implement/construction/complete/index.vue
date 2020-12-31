<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 14:16:28
 * @Description: 施工档案归档、竣工验收
-->
<template>
  <div v-loading="pageLoading" class="app-container">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>材料上传</span>
      <el-button type="success" style="float:right" @click="handlePost">提 交</el-button>
    </el-row>

    <el-card class="upload-card" style="margin-bottom:30px">
      <div slot="header">
        <span>档案归档</span>
      </div>
      <el-upload action="#" :file-list="archiveList" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,0)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,0)}" drag :auto-upload="false">
        <!-- <i class="el-icon-upload" /> -->
        <div>将文件拖到此处，或点击添加</div>
        <p>单个文件大小不超过20MB，可上传图片或PDF</p>
      </el-upload>
    </el-card>
    <el-card class="upload-card" style="margin-bottom:30px">
      <div slot="header">
        <span>竣工验收</span>
      </div>
      <el-upload action="#" :file-list="finishList" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,1)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,1)}" drag :auto-upload="false">
        <!-- <i class="el-icon-upload" /> -->
        <div>将文件拖到此处，或点击添加</div>
        <p>单个文件大小不超过20MB，可上传图片或PDF</p>
      </el-upload>
    </el-card>
  </div>
</template>

<script>
import File from '@/api/file'
import { advanceApi } from '@/api/projects'
import { checkUpload } from '@/utils'
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
      status: null, // 工程阶段标识位
      archiveList: [],
      finishList: []
    }
  },

  computed: {
  },
  watch: {

  },
  created() {
    const { id, status } = this.$route.params
    // 3第二次提交材料
    if (!isNaN(+id) && +status === 11) {
      this.projectId = id
      this.status = status
    }
  },
  methods: {

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList, type) {
      const valid = checkUpload(file.raw)
      if (valid && file.url === undefined) {
        const formData = new FormData()
        formData.append('file', file.raw)
        const showFile = {
          uid: file.uid,
          name: file.name
        }
        const upload = {
          type,
          uid: file.uid,
          file: formData
        }
        const arr = type === 0 ? 'archiveList' : 'finishList'
        this[arr].push(showFile)
        this.uploadList.push(upload)
      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList, type) {
      const arr = type === 0 ? 'archiveList' : 'finishList'
      const cancelIdx = this[arr].findIndex(f => f.uid === file.uid)
      this[arr].splice(cancelIdx, 1)
      const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
      this.uploadList.splice(removeIdx, 1)
    },

    // 保存修改
    async handlePost() {
      this.pageLoading = true
      let error = false
      const idx1 = this.uploadList.findIndex(v => v.type === 1) === -1
      const idx2 = this.uploadList.findIndex(v => v.type === 0) === -1
      if (idx1 || idx2) {
        // 判断是否都上传了
        this.$message.error('请上传附件')
        return
      }
      for (const idx in this.uploadList) {
        const { type, file } = this.uploadList[idx]
        const arr = type === 0 ? 'archiveList' : 'finishList'
        await File.upload(file, { typeName: this.dirName[type], projectId: this.projectId })
          .catch(() => {
            // 上传失败
            const failIdx = this[arr].findIndex(f => f.uid === this.uploadList[idx].uid)
            this[arr].splice(failIdx, 1)
            error = true
          })
      }
      this.uploadList = []
      this.pageLoading = false
      if (error) {
        this.$message.error('部分文件保存失败')
        return
      }
      await advanceApi(this.projectId, this.status)
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
    // 3第二次提交材料
    const illegal = isNaN(+id) || +status !== 11

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
