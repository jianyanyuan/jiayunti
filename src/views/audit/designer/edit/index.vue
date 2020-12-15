<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-15 16:11:52
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
          <el-tag :type="audit.status | keyToVal(auditTag)">{{ audit.status | keyToVal(auditStatus) }}</el-tag>
        </div>
        <el-form v-if="audit.status !== 0" label-position="left" inline class="demo-table-expand">
          <el-form-item label="审核人">
            <span>{{ audit.name }}</span>
          </el-form-item>
          <el-form-item label="审核机构">
            <span>{{ audit.insitution }}</span>
          </el-form-item>
          <el-form-item label="机构地址：">
            <span>{{ audit.address }}</span>
          </el-form-item>
          <el-form-item label="电话：">
            <span>{{ audit.phone }}</span>
          </el-form-item>
          <el-form-item label="审核时间：">
            <span>{{ audit.time }}</span>
          </el-form-item>
          <el-form-item label="审核意见：">
            <span>{{ audit.comments }}</span>
          </el-form-item>
        </el-form>
        <!-- <div slot=" header">
            <span>基本信息</span>
        </div>
        <div>
          <p>姓名：{{ basic.name }}</p>
          <p>详细地址：{{ basic.address }}</p>
          <p>电话：{{ basic.phone }}</p>
          <p>加装电梯地址：{{ basic.liftAddress }}</p>
          <p>设计单位：{{ basic.company }}</p>
          <p>设备规格：{{ basic.spec }}</p>
        </div> -->
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
import { notEmptyArray } from '@/utils'
import Project from '@/api/projects'
export default {
  name: 'DesignerEdit',
  data() {
    return {
      projectId: null,
      status: null,
      audit: {
        status: 1,
        insitution: '图审机构',
        address: '苏州高新区',
        phone: '15988800323',
        name: '李先生',
        time: '2020-10-13 08:00',
        comments: '审核通过'
      },
      auditStatus: [
        { key: 0, val: '审核中' },
        { key: 1, val: '审核未通过' },
        { key: 2, val: '审核通过' }
      ],
      auditTag: [
        { key: 0, val: 'warning' },
        { key: 1, val: 'danger' },
        { key: 2, val: 'success' }
      ],
      typeName: 'construction-review-form',
      pageLoading: false,
      fileList: [], // 展示用
      uploadList: [], // 上传用
      deleteList: [] // 删除用

    }
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
        this.pageLoading = false
      }).catch(err => {
        console.log(err)
        this.$message.error('信息获取失败')
        this.pageLoading = false
      })
    },

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList) {
      const valid = this.checkUpload(file.raw)
      if (valid && file.status === 'ready') {
        this.fileList.push({
          uid: file.uid,
          name: file.name,
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
    // 图片上传之前判断
    checkUpload(file) {
      if (!file.size) {
        this.$message.error('上传为空！')
        return false
      }
      const typeAllowed = /\bpdf|\bimage/i.test(file.type)
      const isBig = file.size <= 1024 * 1024 * 10 // 单个文件最大10M
      if (!typeAllowed) {
        this.$message.error('只能上传图片或pdf！')
        return false
      }
      if (!isBig) {
        this.$message.error('图片大小不能超过10MB！')
        return false
      }
      return true
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
        await Project.advance(this.projectId, this.status)
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
.demo-table-expand {
  font-size: 0;
}

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
.head {
  height: 30px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.edit-upload /deep/ .el-upload--picture-card {
  border-style: solid;
}
</style>

