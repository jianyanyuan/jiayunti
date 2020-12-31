<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 13:27:40
 * @Description: 公示/公告上传
-->
<template>
  <div v-loading="pageLoading" class="app-container">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>材料上传</span>
      <el-button v-if="hasChanged" type="primary" style="float:right" @click="hasChanged = !hasChanged">修 改</el-button>
      <el-button v-else type="success" style="float:right" @click="postFile">提 交</el-button>
    </el-row>
    <template v-if="hasChanged">
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>公示内容</span>
        </div>
        <upload-list :files="contentList" list-type="picture-card" :disabled="true" />

      </el-card>
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>公示公告</span>
        </div>
        <upload-list :files="reportList" list-type="picture-card" :disabled="true" />

      </el-card>
      <!-- <div style="text-align:center">

        <el-button type="success" icon="el-icon-upload2" @click="postApply">提交</el-button>

      </div> -->
    </template>

    <template v-else>
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>公示内容</span>
        </div>
        <el-upload action="#" :file-list="contentList" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,0)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,0)}" drag :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
          <div>将文件拖到此处，或点击添加</div>
          <p>单个文件大小不超过20MB，可上传图片或PDF</p>
        </el-upload>
      </el-card>
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>公示公告</span>
        </div>
        <el-upload action="#" :file-list="reportList" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,1)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,1)}" drag :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
          <div>将文件拖到此处，或点击添加</div>
          <p>单个文件大小不超过20MB，可上传图片或PDF</p>
        </el-upload>
      </el-card>
    </template>
  </div>
</template>

<script>
import File from '@/api/file'
import { advanceApi } from '@/api/projects'
import { notEmptyArray, checkUpload } from '@/utils'
// import { deepClone } from '@/utils'
export default {
  name: 'ApplyNotice',
  data() {
    return {
      // 修改后重新保存
      hasChanged: false,
      // formLoading: false,
      pageLoading: false,
      contentList: [], // 公示内容
      reportList: [], // 公示报告
      uploadList: [], // 上传用
      dirName: ['notice-content', 'notice-report'],
      id: null, // 工程id
      status: null // 工程阶段标识位
    }
  },

  computed: {
  },
  watch: {

  },
  created() {
    const { id, status } = this.$route.params
    // 3第二次提交材料
    if (!isNaN(+id) && +status === 3) {
      this.id = id
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
        const arr = type === 0 ? 'contentList' : 'reportList'
        this[arr].push(showFile)
        this.uploadList.push(upload)
      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList, type) {
      // const index = this.fileList[room].findIndex(v => v.uid === file.uid)
      // const removed = this.fileList[room].splice(index, 1)
      const arr = type === 0 ? 'contentList' : 'reportList'
      const cancelIdx = this[arr].findIndex(f => f.uid === file.uid)
      this[arr].splice(cancelIdx, 1)
      const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
      this.uploadList.splice(removeIdx, 1)
    },

    // 保存修改
    async postFile() {
      if (this.contentList.length === 0 || this.reportList.length === 0) {
        this.$message.error('请补全附件')
        return
      }
      this.pageLoading = true
      if (notEmptyArray(this.uploadList)) {
        let error = false
        for (const idx in this.uploadList) {
          const { type, file } = this.uploadList[idx]
          const arr = type === 0 ? 'contentList' : 'reportList'
          await File.upload(file, { typeName: this.dirName[type], projectId: this.id })
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
        await advanceApi(this.id, 3).catch(() => {
          this.$message.error('流程错误')
        })
        this.$router.push('/resident/list')
      }
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 3第二次提交材料
    const illegal = isNaN(+id) || +status !== 3

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
