/*
 * @Author: zfd
 * @Date: 2020-12-04 10:50:09
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-04 10:50:35
 * @Description:
 */
import * as File from '@/api/file'
// import { deepClone } from '@/utils'
import Pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'
import { notEmptyArray } from '@/utils'

export default {
  components: {
    Pdf
  },
  data() {
    return {
      // 修改后重新保存
      pdfVisible: false,
      pdfURL: '', // Pdf路径
      pdfPages: undefined, // pdf内容
      imgVisible: false,
      detailImgUrl: '',
      hasChanged: false,
      pageLoading: false,
      fileList: [], // 展示用

      uploadList: [], // 上传用
      deleteList: [] // 删除用
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
        if (this.filelist.length > 0) {
          this.$emit('nextProcess', arrow)
        } else {
          this.$message.error('请补全材料')
        }
      }
    },
    // 展示文件
    detailFile(file) {
      if (/\bpdf/i.test(file.name)) {
        // 展示pdf
        this.pdfURL = Pdf.createLoadingTask('/teat.pdf')
        this.pdfURL.promise.then(pdf => {
          this.pdfPages = pdf.numPages
          this.pdfVisible = true
        }).catch(() => {
          this.$message.error('pdf预览失败')
        })
      } else {
        this.detailImgUrl = file.url
        this.imgVisible = true
      }
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList) {
      const valid = this.checkUpload(file.raw)
      if (valid && file.status === 'ready') {
        this.fileList.push({
          uid: file.uid,
          name: file.name,
          url: file.url
        })
        const formData = new FormData()
        formData.append('file', file.raw)
        this.uploadList.push({
          projectId: this.id,
          uid: file.uid,
          name: file.name,
          url: file.url,
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
      if (file.status === 'success') {
        this.deleteList.push(
          {
            projectId: this.id,
            uid: file.uid,
            name: file.name,
            url: file.url
          }
        )
      }
    },
    // 提交材料
    postApply(typeId) {
      this.pageLoading = true
      let uploadAsync = new Promise(resolove => resolove('未修改'))
      let deleteAsync = new Promise(resolove => resolove('未修改'))
      if (notEmptyArray(this.uploadList)) {
        let error = false
        uploadAsync = new Promise((resolove, reject) => {
          this.uploadList.forEach(async(v, i) => {
            const { projectId, file } = v
            const last = i === this.uploadList.length - 1
            await File.upload(file, { projectId, typeId }).then(() => {
              this.uploadList.splice(i, 1)
              if (last) {
                error ? (resolove('上传完成')) : (reject('部分文件上传失败'))
              }
            })
              .catch(() => {
                // 上传失败
                const failIndx = this.fileList.findIndex(f => f.uid === v.uid)
                this.fileList.splice(failIndx, 1)
                error = true
              })
          })
        })
      }
      if (notEmptyArray(this.deleteList)) {
        let error = false
        deleteAsync = new Promise((resolove, reject) => {
          this.deleteList.forEach(async(v, i) => {
            const last = i === this.deleteList.length - 1
            File.remove(v.uid).then(() => {
              this.deleteList.splice(i, 1)
              const delIndx = this.fileList.findIndex(f => f.uid === v.uid)
              this.fileList.splice(delIndx, 1)
              if (last) {
                error ? (resolove('删除完成')) : (reject('部分文件删除失败'))
              }
            }).catch((err) => {
              console.log(err)
              this.fileList.push(v)
              error = true
            })
          })
        })
      }
      Promise.all([uploadAsync, deleteAsync]).then(() => {
        this.pageLoading = false
        this.hasChanged = true
      }).catch(() => {
        this.$message.error('保存失败')
        this.pageLoading = false
      })
    },
    // 打印pdf
    printPDF() {
      html2canvas(this.$refs.printContent, {
        backgroundColor: null,
        useCORS: true,
        windowHeight: document.body.scrollHeight
      }).then((canvas) => {
        const url = canvas.toDataURL()
        printJS({
          printable: url,
          type: 'image',
          documentTitle: this.printName
        })
        // console.log(url)
      })
    }
  }
}
