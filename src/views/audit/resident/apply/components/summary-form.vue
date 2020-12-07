<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-07 16:11:15
 * @Description: 居民申请意见汇总表
-->
<template>
  <div v-loading="pageLoading">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>意见征询汇总表</span>
      <el-button v-if="hasChanged" type="primary" style="float:right" @click="hasChanged = !hasChanged">修改</el-button>
      <el-button v-else type="primary" style="float:right" @click="hasChanged = !hasChanged">保存</el-button>
    </el-row>
    <template v-if="hasChanged">
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>查看</span>
        </div>
        <upload-list :files="fileList" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />

      </el-card>
    </template>

    <template v-else>
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>上传</span>
        </div>
        <el-upload action="#" :file-list="fileList" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList)}" drag :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
          <div>将文件拖到此处，或点击添加</div>
          <p>单个文件大小不超过20MB，可上传图片或PDF</p>
        </el-upload>
      </el-card>
      <div style="text-align:center">
        <el-button type="primary" icon="el-icon-arrow-left" @click.native.prevent="nextProcess(-1)">上一步</el-button>
        <el-button v-if="hasChanged" type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>
      </div>
    </template>
    <el-dialog center title="图片详情" :visible.sync="imgVisible" :close-on-click-modal="false" class="dialog-center">
      <img :src="detailImgUrl" alt="意见咨询表">
    </el-dialog>
    <el-dialog title="pdf预览" :visible.sync="pdfVisible" :close-on-click-modal="false" class="dialog-center">
      <!-- 加载全部页面的PDF是一个for循环,不能指定用来打印的ref -->
      <div ref="printContent">
        <Pdf v-for="i in pdfPages" :key="i" :src="pdfURL" :page="i" />
      </div>
      <span slot="footer">
        <el-button @click="printPDF">打印</el-button>
        <!-- <el-button type="primary" @click="printImg">转图片打印</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as File from '@/api/file'
// import { deepClone } from '@/utils'
import Pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'
export default {
  name: 'ApplySummary',
  data() {
    return {
      // 修改后重新保存
      pdfVisible: false,
      pdfURL: '', // Pdf路径
      pdfPages: undefined,// pdf内容
      imgVisible: false,
      detailImgUrl: '',
      hasChanged: false,
      pageLoading: false,
      fileList: [], // 展示用

      uploadList: [], // 上传用
      deleteList: [], // 删除用
    }
  },
  components: {
    Pdf
  },
  created() {
    this.detailApply()
  },
  methods: {
    activated() {
      this.detailApply()
    },
    nextProcess(arrow) {
      if(arrow < 0) {
        this.$emit('nextProcess', arrow)
      }else {
        if(this.filelist.length > 0) {
          this.$emit('nextProcess', arrow)
        }else {
          this.$message.error('请补全材料')
        }
      }
    },
    // 获取已上传的意见征询汇总表
    detailApply() {
      this.pageLoading = true
      this.fileList = []
      this.uploadList = []
      this.deleteList = []
      File.get({ projectId: this.id, typeName: '意见征询汇总表' }).then(res => {
        if (notEmptyArray(res.content)) {
          for (const i of res.content) {
            this.fileList.push({
              uid: v.id,
              name: v.fileName,
              url: v.path
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
    postApply() {
      this.pageLoading = true
      let uploadAsync = new Promise(resolove => resolove('未修改'))
      let deleteAsync = new Promise(resolove => resolove('未修改'))
      if (notEmptyArray(this.uploadList)) {
        let error = false
        uploadAsync = new Promise((resolove, reject) => {
          this.uploadList.forEach(async (v, i) => {
            const { projectId, file } = v
            const last = i === this.uploadList.length - 1
            await File.upload(file, { projectId, typeName: '意见征询汇总表' }).then(() => {
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
          this.deleteList.forEach(async (v, i) => {
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
    },
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
