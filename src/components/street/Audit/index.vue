<!--
 * @Author: zfd
 * @Date: 2020-10-16 16:35:29
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-21 17:16:43
 * @Description:
-->
<template>
  <div v-loading="pageLoading">
    <el-form label-width="120px" ref="form" :model="form" :rules="rule">
      <el-form-item label="审核意见:" prop="reviewOpinions">
        <el-input v-model="form.reviewOpinions" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="审核表:">
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
        <el-select v-model="form.reviewResults" :disabled="conflict === true">
          <el-option v-for="item in auditOptions" :key="item.val" :value="item.key" :label="item.val" />
        </el-select>
        <el-tag type="danger" style="margin-left:20px" size="large" v-if="conflict === true" class="audit-conflict">异议冲突</el-tag>
      </el-form-item>
      <el-form-item class="audit-operation">
        <el-button type="success" size="medium" icon="el-icon-upload2" @click="handlePost">提 交</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {checkApi,advanceApi} from '@/api/projects'
import File from '@/api/file'
import { mapState } from 'vuex'
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
    },
    conflict: {
      type: Boolean
    }
  },
  data() {
    return {
      pageLoading: false,
      form: {
        reviewOpinions: '',
        reviewResults: 0
      },
      rule: {
        reviewOpinions: [{ required: true, message: '请给出审核意见', trigger: 'blur' }],
        reviewResults: [{ required: true, message: '请给出审核结果', trigger: 'blur' }]
      },
      attachment: null,
    }
  },
  created() {
    if (this.conflict === true) {
      this.form.reviewResults = 1 // 不通过
    }
  },
  computed: {
    typeName() {
      switch (+this.status) {
        case 1:
          return 'community-review-form' // 社区审核
        case 4:
          return 'notice-review-form' // 公示审核
        case 7:
          return 'construction-review-form' // 施工图审核
        case 9:
          return 'street-review-form' // 街道审核
        case 10:
          return 'union-review-form' // 联合审查
        default:
          return 'errors'
      }
    },
    ...mapState('common', ['auditOptions'])

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
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.pageLoading = true
          this.form.projectId = this.id
          if (this.status == 10) {
            // 10 联合审查，4个部门，type要区分
            const roleMapType = new Map([['ROLE_CAPITAL_RULE', 11], ['ROLE_HOUSE_CONSTRUCTION', 12], ['ROLE_URBAN_MANAGEMENT', 13], ['ROLE_MARKET_SUPERVISOR', 14]])
            this.form.type = roleMapType.get(this.$store.getters.roles[0])
          } else {
            this.form.type = this.status
          }
          // const taskAsync = []
          if (this.attachment !== null) {
            const fileRes = await File.upload(this.attachment.file, { projectId: this.id, typeName: this.typeName })
            if (fileRes.fileTypeId) {
              this.attachment = null
              this.form.fileId = fileRes.fileTypeId
            } else {
              this.$message.error('附件上传失败')
              this.pageLoading = false
              return
            }
          }
          checkApi(this.form)
            .then(async () => {
              if (this.status != 10) {
                // 10 联合审查 审核过,流程不前进
                await advanceApi(this.id, this.status).catch(() => {
                  this.$message.error('流程错误')
                })
              }
              this.pushPage()
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
    pushPage() {
      switch (+this.status) {
        case 1:
          this.$router.push('/community/list')
          break
        case 4:
          this.$router.push('/community/list')
          break
        case 7:
          this.$router.push('/drawing-audit/list')
          break
        case 9:
          this.$router.push('/street/list')
          break
        case 10:
          this.$router.push('/union/list')
          break
        default:
          this.$router.push('/404')
          break
      }
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
