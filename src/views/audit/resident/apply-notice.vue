<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-11 14:43:50
 * @Description: 公示/公告上传
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>材料上传</span>
      <el-button v-if="hasChanged" type="primary" style="float:right" @click="hasChanged = !hasChanged">修 改</el-button>
      <el-button v-else type="success" style="float:right" @click="hasChanged = !hasChanged">提 交</el-button>
    </el-row>
    <template v-if="hasChanged">
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>公示内容</span>
        </div>
        <upload-list :files="contentList" list-type="picture-card" :disabled="true" :handle-preview="detailImg" />

      </el-card>
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>公示公告</span>
        </div>
        <upload-list :files="reportList" list-type="picture-card" :disabled="true" :handle-preview="detailImg" />

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
        <el-upload action="#" :file-list="contentList" 
        :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,0)}" 
        :on-change="function(file,fileList){return handleUploadChange(file,fileList,0)}" 
        list-type="picture" drag :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
          <div>将文件拖到此处，或点击添加</div>
          <p>单个文件大小不超过20MB，可上传图片或PDF</p>
        </el-upload>
      </el-card>
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>公示公告</span>
        </div>
        <el-upload action="#" :file-list="reportList" 
        :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,1)}" 
        :on-change="function(file,fileList){return handleUploadChange(file,fileList,1)}" 
        list-type="picture" drag :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
          <div>将文件拖到此处，或点击添加</div>
          <p>单个文件大小不超过20MB，可上传图片或PDF</p>
        </el-upload>
      </el-card>
    </template>
    <el-dialog center title="图片详情" :visible.sync="imgVisible" :close-on-click-modal="false" class="dialog-center">
      <img :src="detailImgUrl" alt="公示附件">
    </el-dialog>
    <el-dialog title="pdf预览" center :visible.sync="pdfVisible" :close-on-click-modal="false" class="dialog-center">
      <!-- 加载全部页面的PDF是一个for循环,不能指定用来打印的ref -->
      <div ref="printContent">
        <Pdf v-for="i in pdfPages" :key="i" :src="pdfURL" :page="i" />
      </div>
      <span slot="footer">
        <el-button @click="printPDF" type="success">打印</el-button>
        <!-- <el-button type="primary" @click="printImg">转图片打印</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import File from '@/api/file'
import { notEmptyArray } from '@/utils'
// import { deepClone } from '@/utils'
import Pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'

export default {
  name: 'ApplyNotice',
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    Pdf
  },
  data() {
    return {
      // 修改后重新保存
      imgVisible: false,
      pdfVisible: false,
      detailImgUrl: '',
      pdfURL: '', // Pdf路径
      pdfPages: undefined,// pdf内容
      hasChanged: false,
      // formLoading: false,
      pageLoading: false,
      contentList: [], // 公示内容
      reportList: [], // 公示报告
      uploadList: [], // 上传用
      deleteList: [], // 删除用
      dirName: ['']
    }
  },

  computed: {
  },
  watch: {

  },
  created() {
    this.detailApply()
  },
  methods: {
    // 获取已上传的意见征询表
    detailApply() {
      this.pageLoading = true
      this.contentList = []
      this.reportList = []
      this.uploadList = []
      this.deleteList = []
            File.get({ projectId: this.id, typeName:  }).then(res => {
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
    nextProcess(arrow) {
      if (arrow > 0) {
        const count = this.rooms.reduce((c, v) => (this.fileList[v].length + c), 0)
        if (count >= this.rooms.length * 3) {
          this.$emit('nextProcess', arrow)
        }
        else {
          this.$message.error('请补全附件，附件分开上传')
        }
      } else {
        this.$emit('nextProcess', arrow)
      }
    },

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList, type) {
      const valid = this.checkUpload(file.raw)
      if (valid && file.status === 'ready') {
        const formData = new FormData()
        formData.append('file', file.raw)
        const file = {
          uid: file.uid,
          name: file.name,
        }
        const upload = {
          uid: file.uid,
          file: formData
        }
        if (type === 0) {
          upload.typeName = 'notice-content'
          this.contentList.push(file)
        } else {
          upload.typeName = 'notice-report'
          this.reportList.push(file)

        }
        this.uploadList.push(upload)

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
    handleUploadRemove(file, fileList, type) {
      // const index = this.fileList[room].findIndex(v => v.uid === file.uid)
      // const removed = this.fileList[room].splice(index, 1)
      const typeName = type === 0 ? 'notice-content' : 'notice-report'
      const arr = type === 0 ? 'contentList' : 'reportList'
      if (file.status === 'success') {
        // 已上传的 --> 待删除
        this.deleteList.push(
          {
            typeName,
            projectId: this.id,
            uid: file.uid,
          }
        )
      } else {
        // 未上传 --> 取消上传
        const cancelIdx = this.fileList[room].findIndex(f => f.uid === file.uid)
        this[arr].splice(cancelIdx, 1)
        const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
        this.uploadList.splice(removeIdx, 1)
      }
    },

    // 保存修改
    postFile() {
      this.pageLoading = true
      let uploadAsync = new Promise(resolove => resolove('未修改'))
      let deleteAsync = new Promise(resolove => resolove('未修改'))
      if (notEmptyArray(this.uploadList)) {
        let error = false
        uploadAsync = new Promise((resolove, reject) => {
          this.uploadList.forEach(async (v, i) => {
            const { typeName, file } = v
            const arr = typeName === 'notice-content' ? 'contentList' : 'reportList'
            const last = i === this.uploadList.length - 1
            await File.upload(file, { typeName, projectId: this.id })
            .then(() => {
              if (last) {
                error ? (reject('部分文件上传失败')) : (resolove('上传完成'))
              }
            })
              .catch(() => {
                // 上传失败
                const failIdx = this[arr].findIndex(f => f.uid === v.uid)
                this[arr].splice(failIdx, 1)
                error = true
              })
            this.uploadList.splice(i, 1)
          })
        })
      }
      if (notEmptyArray(this.deleteList)) {
        let error = false
        deleteAsync = new Promise((resolove, reject) => {
          this.deleteList.forEach(async (v, i) => {
            const last = i === this.deleteList.length - 1
            const arr = v.typeName === 'notice-content' ? 'contentList' : 'reportList'
            await File.remove(v.uid)
            .then(() => {
              const delIndx = this[arr].findIndex(f => f.uid === v.uid)
              this[arr].splice(delIndx, 1)
              if (last) {
                error ? (reject('部分文件删除失败')) : (resolove('删除完成'))
              }
            })
            .catch((err) => {
              console.log(err)
              this[arr].push(v)
              error = true
            })
            this.deleteList.splice(i, 1)
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
    }
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
