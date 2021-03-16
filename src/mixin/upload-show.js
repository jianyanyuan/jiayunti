/*
 * @Author: zfd
 * @Date: 2020-12-04 10:50:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-03-16 17:11:28
 * @Description: 附件上传 + 预览通用模块
 */
import File from '@/api/file'
import { notEmptyArray, checkUpload } from '@/utils'

export default {
  data() {
    return {
      // 修改后重新保存
      hasChanged: false,
      pageLoading: false,
      fileList: [], // 展示用
      uploadedCount: 0 // 记录用
    }
  },
  activated() {
    this.detailApply()
  },
  methods: {
    async nextProcess(arrow) {
      if (arrow < 0) {
        this.$emit('nextProcess', arrow)
      } else {
        // await this.detailApply()
        if (this.uploadedCount > 0) {
          this.$emit('nextProcess', arrow)
        } else {
          this.$message.warning('请先上传材料')
        }
      }
    },
    // 获取文件
    async detailApply() {
      this.pageLoading = true
      this.fileList = []
      this.uploadedCount = 0
      if (this.typeName === 'locale-form') {
        await File.getLocalFile(this.id).then(res => {
          if (notEmptyArray(res.content)) {
            for (const i of res.content) {
              this.fileList.push({
                uid: i.id,
                name: i.filename,
                url: i.path
              })
            }
            this.uploadedCount = res.content.length
          }
          this.pageLoading = false
        }).catch((errMsg) => {
          this.$message.error(errMsg)
          this.pageLoading = false
        })
      } else {
        await File.get({ projectId: this.id, typeName: this.typeName }).then(res => {
          if (notEmptyArray(res.content)) {
            for (const i of res.content) {
              this.fileList.push({
                uid: i.id,
                name: i.filename,
                url: i.path
              })
            }
            this.uploadedCount = res.content.length
          }
          this.pageLoading = false
        }).catch((errMsg) => {
          this.$message.error(errMsg)
          this.pageLoading = false
        })
      }
    },
    handlePreview() {
      this.hasChanged = true
      this.detailApply()
    },
    handleUploadChange(file, fileList) {
      const valid = checkUpload(file.raw)
      if (valid && file.url === undefined) {
        const formData = new FormData()
        formData.append('file', file.raw)
        File.upload(formData, { projectId: this.id, typeName: this.typeName })
          .then(res => {
            file.url = res.fileAddress
            file.status = 'success'
            file.uid = res.fileTypeId
            this.uploadedCount++
          })
          .catch((errMsg) => {
          // 上传失败
            this.$message.error(errMsg)
          })
      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList) {
      File.remove(file.uid)
        .catch((errMsg) => {
          this.$message.error(errMsg)
        })
    }
  }
}
