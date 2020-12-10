<!--
 * @Author: zfd
 * @Date: 2020-10-16 16:35:29
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-10 10:24:08
 * @Description:
-->
<template>
  <div v-loading="pageLoading">
    <el-form label-width="120px" ref="form" :model="form" :rules="rule">
      <el-form-item label="审核意见:" prop="reviewOpinions">
        <el-input v-model="form.reviewOpinions" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="审核表:" prop="attachment">
        <el-upload action="#" class="form-card" :limit="1" :on-remove="handleUploadRemove" :on-change="handleUploadChange" drag :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
          <div class="enclosure-tips">
            审核意见表
          </div>
          <div>将文件拖到此处，或点击添加</div>
          <div>单个文件大小不超过20MB，可上传图片或PDF</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="审核结果:" prop="reviewResults">
        <el-select v-model="form.reviewResults">
          <el-option v-for="item in resultOptions" :key="item.val" :value="item.key" :label="item.val" />
        </el-select>
      </el-form-item>
      <el-form-item class="audit-operation">
        <el-button type="success" size="medium" icon="el-icon-upload2" @click="handlePost">提 交</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import Project from '@/api/projects'
import * as File from '@/api/file'
export default {
  name: 'Audit',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    status: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      pageLoading: false,
      form: {
        reviewOpinions: '',
        reviewResults: 1
      },
      rule: {
        reviewOpinions: [{ required: true, message: '请给出审核意见', trigger: 'blur' }],
        reviewResults: [{ required: true, message: '请给出审核结果', trigger: 'blur' }]
      },
      resultOptions: [
        { key: 1, val: '通过' },
        { key: 0, val: '不通过' }
      ],
      attachment: null,
    }
  },
  computed: {
    typeName() {
      if (this.status == 1) {
        return 'community-review-form' // 社区审核
      } else {
        return 'errors' // 错误
      }
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
        this.attachment = {
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
      this.attachment = null
      fileList = []
    },
    handlePost() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.pageLoading = true
          this.form.projectId = this.id
          const taskAsync = []
          if (this.attachment !== null) {
            this.form.uid = this.attachment.uid
            attachmentAsync = File.upload({ file: this.attachment.file }, { projectId: this.id, typeName: this.typeName }).then(() => {
              this.attachment = null
            })
            taskAsync.push(attachmentAsync)
          }
          const resultAsync = Project.communityCheck(this.form)
          taskAsync.push(resultAsync)

          Promise.all(taskAsync)
            .then(() => {
              this.pageLoading = false
              this.$router.push('/community/list')
            })
            .catch(() => {
              this.$message.error('审核失败')
              this.pageLoading = false
            })
        } else {
          this.$message.error('请补全信息')
        }
      })
    }
  }
}
</script>

<style scoped>
.enclosure-tips {
  color: #14274e;
  text-align: left;
}
.audit-operation {
  margin-top: 50px;
}
.form-card ::v-deep .el-upload-dragger {
  width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
.enclosure-tips {
  color: #14274e;
  text-align: center;
}
</style>
