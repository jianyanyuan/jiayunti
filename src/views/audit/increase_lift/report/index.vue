<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-25 11:23:07
 * @Description: 增梯办联合审查报告
-->
<template>
  <div class="app-container">
    <el-page-header style="margin-bottom:20px" content="上传联合审批报告" @back="$router.go(-1)" />

    <el-card>
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>联合审批报告</span>
        </el-row>
      </div>
      <el-form label-width="120px" ref="form" :model="form" :rules="rule">
        <el-form-item label="审核意见:" prop="reviewOpinions">
          <el-input v-model="form.reviewOpinions" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="报告:" prop="attachment">
          <el-upload action="#" class="form-card" :limit="1" :on-remove="handleUploadRemove" :on-change="handleUploadChange" drag :auto-upload="false">
            <!-- <i class="el-icon-upload" /> -->
            <div class="enclosure-tips">
              联合审查报告
            </div>
            <div>将文件拖到此处，或点击添加</div>
            <div>单个文件大小不超过20MB，可上传图片或PDF</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="审核结果:" prop="reviewResults">
          <el-select v-model="form.reviewResults">
            <el-option v-for="item in auditOptions" :key="item.val" :value="item.key" :label="item.val" />
          </el-select>
        </el-form-item>
        <el-form-item class="audit-operation">
          <el-button type="success" size="medium" icon="el-icon-upload2" @click="handlePost">提 交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { advanceApi, checkApi } from '@/api/projects'
import File from '@/api/file'
import { mapState } from 'vuex'

export default {
  name: 'UnionReport',
  data() {
    return {
      projectId: null,
      status: null,
      typeName: 'union-report',
      pageLoading: false,
      form: {
        reviewOpinions: '',
        reviewResults: 0,
        attachment: null
      },
      rule: {
        reviewOpinions: [{ required: true, message: '请给出审核意见', trigger: 'blur' }],
        reviewResults: [{ required: true, message: '请给出审核结果', trigger: 'blur' }],
        attachment: [{ required: true, message: '请上传报告', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('common', ['auditOptions'])

  },
  created() {
    const { id, status } = this.$route.params
    // 10 联合审查
    const valid = status == 1 || status == 10
    if (!isNaN(+id) && valid) {
      this.projectId = id
      this.status = status
    }
  },
  methods: {
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList) {
      const valid = this.checkUpload(file.raw)
      if (valid && file.status === 'ready') {
        const formData = new FormData()
        formData.append('file', file.raw)
        this.form.attachment = {
          uid: file.uid,
          name: file.name,
          file: formData,
        }
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
      this.form.attachment = null
      fileList = []
    },
    handlePost() {
      if (this.form.attachment === null) {
        this.$message.error('请上传报告')
        return
      }
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.pageLoading = true
          this.form.projectId = this.projectId
          this.form.type = this.status
          const fileRes = await File.upload(this.form.attachment.file, { projectId: this.projectId, typeName: this.typeName })
          if (fileRes.fileTypeId) {
            this.form.attachment = null
            this.form.fileId = fileRes.fileTypeId
          } else {
            this.$message.error('报告上传失败')
            this.pageLoading = false
            return
          }
          checkApi(this.form)
            .then(async () => {
              await advanceApi(this.projectId, this.status)
                .then(() => {
                  this.$router.push('/increase-lift/list')
                })
                .catch((err) => {
                  this.$message.error('部门流转未完成')
                })
            })
            .catch(() => {
              this.$message.error('审核失败')
            })
            .finally(() => {
              this.pageLoading = false
            })
        } else {
          this.$message.error('请补全信息')
        }
      })
    },
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 10 联合审查报告
    const valid = status == 1 || status == 10
    if (isNaN(+id) || !valid) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  }
}
</script>

<style scoped lang="scss">
.basic-container ::v-deep .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}
.enclosure-tips {
  color: #14274e;
  text-align: center;
}
.show-form ::v-deep {
  .el-cascader,
  .el-input__suffix-inner {
    pointer-events: none;
    cursor: default;
    opacity: 0.8;
  }
}
.upload-card {
  text-align: center;
  margin-bottom: 30px;
}

.form-card ::v-deep .el-upload-dragger {
  width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
.image-container {
  text-align: center;
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
