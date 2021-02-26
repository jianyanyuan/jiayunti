/*
 * @Author: zfd
 * @Date: 2020-12-04 10:50:09
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 13:09:35
 * @Description: 附件上传 + 预览通用模块
 */
import File from '@/api/file'
// import { deepClone } from '@/utils'
import { notEmptyArray, checkUpload } from '@/utils'

export default {
  data() {
    return {
      // 修改后重新保存
      hasChanged: true,
      pageLoading: false,
      fileList: [], // 展示用
      uploadList: [] // 上传用
    }
  },
  activated() {
    this.detailApply()
  },
  methods: {
    nextProcess(arrow) {
      if (arrow < 0) {
        this.$emit('nextProcess', arrow)
      } else {
        if (this.hasChanged && this.fileList.length > 0) {
          this.$emit('nextProcess', arrow)
        } else {
          this.$message.warning('请先上传材料')
        }
      }
    },
    // 获取文件
    detailApply() {
      this.pageLoading = true
      this.fileList = []
      this.uploadList = []
      if (this.typeName === 'locale-form') {
        File.getLocalFile(this.id).then(res => {
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
        }).catch(() => {
          this.$message.error('信息获取失败')
          this.pageLoading = false
        })
      } else {
        File.get({ projectId: this.id, typeName: this.typeName }).then(res => {
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
        }).catch(() => {
          this.$message.error('信息获取失败')
          this.pageLoading = false
        })
      }
    },

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList) {
      const valid = checkUpload(file.raw)
      if (valid && file.url === undefined) {
        const reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload = (event) => {
          this.fileList.push({
            uid: file.uid,
            name: file.name,
            url: event.target.result,
            type: 'temp' // 临时保存base64结果
          })
        }
        const formData = new FormData()
        formData.append('file', file.raw)
        this.uploadList.push({
          projectId: this.id,
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
      const cancelIdx = this.fileList.findIndex(f => f.uid === file.uid)

      if (file.type === 'temp') {
        // 未上传 --> 取消上传
        this.fileList.splice(cancelIdx, 1)
        const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
        this.uploadList.splice(removeIdx, 1)
      } else {
        // 已上传的 --> 待删除
        File.remove(file.uid)
          .then(() => {
            this.fileList.splice(cancelIdx, 1)
          })
          .catch(() => {
            this.$message.error('删除失败')
          })
      }
    },

    // 保存修改
    async postApply(typeName) {
      this.pageLoading = true

      if (notEmptyArray(this.uploadList)) {
        let err = false
        for (const idx in this.uploadList) {
          const { projectId, file } = this.uploadList[idx]
          await File.upload(file, { projectId, typeName })
            .catch(() => {
              // 上传失败
              const failIdx = this.fileList.findIndex(f => f.uid === this.uploadList[idx].uid)
              this.fileList.splice(failIdx, 1)
              err = true
            })
        }
        this.uploadList = []
        if (err) {
          this.$message.error('保存失败')
        }
        this.hasChanged = true
        this.pageLoading = false
        this.detailApply()
      } else {
        this.hasChanged = true
        this.pageLoading = false
        this.detailApply()
      }
    }
  }
}
