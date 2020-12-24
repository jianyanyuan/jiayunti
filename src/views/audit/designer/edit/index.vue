<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-24 10:30:18
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\card\index.vue
-->
<template>
  <div class="app-container">
    <el-page-header style="margin-bottom:20px" content="修改设计图" @back="$router.go(-1)" />

    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span style="margin-right:20px">审核信息</span>
          <el-tag :type="audit.reviewResult | keyToVal(handleTag)">{{ audit.reviewResult | keyToVal(auditOptions) }}</el-tag>
        </div>
        <el-form label-position="left" class="demo-table-expand">
          <el-form-item label="审核机构">
            <span>{{ audit.reviewOrganization }}</span>
          </el-form-item>
          <el-form-item label="机构地址：">
            <span>{{ audit.address }}</span>
          </el-form-item>
          <el-form-item label="电话：">
            <span>{{ audit.phone }}</span>
          </el-form-item>
          <el-form-item label="审核时间：">
            <span>{{ audit.auditTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </el-form-item>
          <el-form-item label="审核意见：">
            <span>{{ audit.reviewOpinion }}</span>
          </el-form-item>
          <el-form-item label="审核结果：">
            <el-tag :type="audit.reviewResult | keyToVal(handleTag)">{{ audit.reviewResult | keyToVal(auditOptions) }}</el-tag>
          </el-form-item>
          <el-form-item label="附件：">
            <upload-list :files="audit.files" list-type="picture-card" :disabled="true" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-upload ref="constructionUpload" class="edit-upload" action="#" list-type="picture-card" :on-remove="handleUploadRemove" :file-list="fileList" :on-change="handleUploadChange" :auto-upload="false">
      <i class="el-icon-plus" />
    </el-upload>

    <div style="height:50px;text-align:center">
      <el-button type="primary" size="medium" @click="postApply(typeName)">提 交</el-button>
    </div>
  </div>
</template>

<script>
import File from '@/api/file'
import Community from '@/api/community'
import { mapState } from 'vuex'

import { notEmptyArray, checkUpload } from '@/utils'
import { advanceApi } from '@/api/projects'
export default {
  name: 'DesignerEdit',
  data() {
    return {
      projectId: null,
      status: null,
      audit: {},
      typeName: 'construction-review-form',
      pageLoading: false,
      fileList: [], // 展示用
      uploadList: [], // 上传用
      deleteList: [] // 删除用

    }
  },
  computed: {
    ...mapState('common', ['handleTag', 'auditOptions'])
  },
  created() {
    const { id, status } = this.$route.params
    //3第二次提交材料
    if (!isNaN(+id) && status == 6) {
      this.projectId = id
      this.status = status
      this.detailApply()
    }
  },
  methods: {
    // 获取文件
    detailApply() {
      this.pageLoading = true
      this.fileList = []
      this.uploadList = []
      this.deleteList = []
      const auditAsync = new Promise((resolve, reject) => {
        Community.checkLatest(this.projectId).then(res => {
          res.files = new Array({ uid: Date.now(), url: res.path })
          this.audit = res
          resolve('ok')
        }).catch(() => {
          reject('审核意见获取失败')
        })
      })
      const fileAsync = new Promise((resolve, reject) => {
        File.get({ projectId: this.projectId, typeName: this.typeName }).then(res => {
          if (notEmptyArray(res.content)) {
            for (const i of res.content) {
              this.fileList.push({
                uid: i.id,
                name: i.filename,
                url: i.path
              })
            }
          }
          resolve('ok')
        }).catch(err => {
          reject('施工图获取失败')
        })
      })
      Promise.all([auditAsync, fileAsync]).catch((err) => {
        console.log(err)
        this.$message.error('信息获取失败')
      })
        .finally(() => {
          this.pageLoading = false
        })
    },

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList) {
      const valid = checkUpload(file.raw)
      if (valid && file.status === 'ready') {
        let reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload((event) => {
          this.fileList.push({
            uid: file.uid,
            name: file.name,
            url: event.target.result
          })
        })
        const formData = new FormData()
        formData.append('file', file.raw)
        this.uploadList.push({
          projectId: this.projectId,
          uid: file.uid,
          name: file.name,
          file: formData
        })
      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList) {
      if (file.url === undefined) {
        // 未上传 --> 取消上传
        const cancelIdx = this.fileList.findIndex(f => f.uid === file.uid)
        this.fileList.splice(cancelIdx, 1)
        const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
        this.uploadList.splice(removeIdx, 1)
      } else {
        // 已上传的 --> 待删除
        this.deleteList.push(
          {
            projectId: this.projectId,
            uid: file.uid,
            name: file.name,
            url: file.url
          }
        )
      }
    },
    // 提交材料
    postApply(typeName) {
      this.pageLoading = true
      let uploadAsync = new Promise(resolove => resolove('未修改'))
      let deleteAsync = new Promise(resolove => resolove('未修改'))
      if (notEmptyArray(this.uploadList)) {
        let error = false
        uploadAsync = new Promise((resolove, reject) => {
          this.uploadList.forEach(async (v, i) => {
            const { projectId, file } = v
            const last = i === this.uploadList.length - 1
            await File.upload(file, { projectId, typeName })
              .catch(() => {
                // 上传失败
                const failIdx = this.fileList.findIndex(f => f.uid === v.uid)
                this.fileList.splice(failIdx, 1)
                error = true
              })
            if (last) {
              error ? (reject('部分文件上传失败')) : (resolove('上传完成'))
            }
            this.uploadList.splice(i, 1)
          })
        })
      }
      if (notEmptyArray(this.deleteList)) {
        let error = false
        deleteAsync = new Promise((resolove, reject) => {
          this.deleteList.forEach(async (v, i) => {
            const last = i === this.deleteList.length - 1
            await File.remove(v.uid)
              .then(() => {
                const delIndx = this.fileList.findIndex(f => f.uid === v.uid)
                this.fileList.splice(delIndx, 1)
              })
              .catch((err) => {
                console.log(err)
                this.fileList.push(v)
                error = true
              })
            if (last) {
              error ? (reject('部分文件删除失败')) : (resolove('删除完成'))
            }
            this.deleteList.splice(i, 1)
          })
        })
      }
      Promise.all([uploadAsync, deleteAsync]).then(async () => {
        await advanceApi(this.projectId, this.status)
          .catch(() => (this.$message.error('流程错误')))
        this.pageLoading = false
        this.$router.push('/designer/list')
      }).catch((err) => {
        console.log(err)
        this.$message.error('保存失败')
        this.pageLoading = false
      })
    },
  },
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    //3第二次提交材料
    const illegal = isNaN(+id) || status != 6

    if (illegal) {
      next('/redirect' + from.fullPath)
    }
    next()
  }
}
</script>

<style scoped>
.demo-table-expand /deep/ label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 20px;
  margin-bottom: 0;
  width: 100%;
}

.basic-container /deep/ .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}

.edit-upload /deep/ .el-upload--picture-card {
  border-style: solid;
}
</style>

