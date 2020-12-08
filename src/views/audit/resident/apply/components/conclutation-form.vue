<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-08 08:27:45
 * @Description: 居民申请意见征询表
-->
<template>
  <div v-loading="pageLoading">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>意见征询表</span>
      <el-button v-if="hasChanged" type="primary" style="float:right" @click="hasChanged = !hasChanged">修改</el-button>
      <el-button v-else type="primary" style="float:right" @click="postFile">保存</el-button>
    </el-row>
    <template v-if="hasChanged">
      <el-card v-for="(room) in rooms" :key="room" class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>{{ room }}</span>
        </div>
        <upload-list :files="fileList[room]" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />
      </el-card>

    </template>

    <template v-else>
      <el-card v-for="(room) in rooms" :key="room" class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>{{ room }}</span>
        </div>
        <el-upload action="#" :file-list="fileList[room]" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,room)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,room)}" drag :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
          <div class="enclosure-tips">
            所需附件：
            <ul>
              <li>
                业主身份证
              </li>
              <li>
                业主房产证
              </li>
              <li>
                意见征询表 / 征询表+委托书+受委托人身份证
              </li>
            </ul>
          </div>
          <div>将文件拖到此处，或点击添加</div>
          <p>单个文件大小不超过20MB，可上传图片或PDF</p>
        </el-upload>
      </el-card>
    </template>
    <div style="text-align:center">
      <el-button type="primary" icon="el-icon-arrow-left" @click.native.prevent="nextProcess(-1)">上一步</el-button>

      <el-button v-if="hasChanged" type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>
    </div>
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
import { notEmptyArray } from '@/utils'
// import { deepClone } from '@/utils'
import Pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'
export default {
  name: 'ApplyConsultation',
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
      rooms: [],
      fileList: [], // 展示用
      uploadList: [], // 上传用
      deleteList: [], // 删除用
    }
  },

  computed: {
  },
  watch: {

  },
  created() {
    // this.detailApply()
  },
  activated() {
    this.detailApply()
  },
  methods: {

    // 获取已上传的意见征询表
    detailApply() {
      this.pageLoading = true
      this.rooms = []
      this.fileList = {}
      this.uploadList = []
      this.deleteList = []
      File.getConsultation({ projectId: this.id }).then(res => {
        if (notEmptyArray(res.content)) {
          for (const i of res.content) {
            const { room, opinionFileList } = i
            this.rooms.push(room)
            if (Array.isArray(opinionFileList)) {
              this.fileList[room] = []
              opinionFileList.forEach(v => {
                this.fileList[room].push({
                  uid: v.opinionFileId,
                  name: v.fileName,
                  url: v.path
                })
              })
            }
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
    handleUploadChange(file, fileList, room) {
      const valid = this.checkUpload(file.raw)
      if (valid && file.status === 'ready') {
        this.fileList[room].push({
          uid: file.uid,
          name: file.name,
          url: file.url
        })
        const formData = new FormData()
        formData.append('file', file.raw)
        this.uploadList.push({
          room,
          projectId: this.id,
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
    handleUploadRemove(file, fileList, room) {
      console.log(file)
      // const index = this.fileList[room].findIndex(v => v.uid === file.uid)
      // const removed = this.fileList[room].splice(index, 1)
      if (file.status === 'success') {
        this.deleteList.push(
          {
            room,
            projectId: this.id,
            uid: file.uid,
            name: file.name
          }
        )
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
            const { room, projectId, file } = v

            const last = i === this.uploadList.length - 1
            await File.uploadOpinion(file, { room, projectId }).then(() => {
              this.uploadList.splice(i, 1)
              if (last) {
                error ? (reject('部分文件上传失败')) : (resolove('上传完成'))
              }
            })
              .catch(() => {
                // 上传失败
                const failIndx = this.fileList[room].findIndex(f => f.uid === v.uid)
                this.fileList[room].splice(failIndx, 1)
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
            File.removeOpinion(v.uid).then(() => {
              this.deleteList.splice(i, 1)
              const delIndx = this.fileList[v.room].findIndex(f => f.uid === v.uid)
              this.fileList[v.room].splice(delIndx, 1)
              if (last) {
                error ? (reject('部分文件删除失败')) : (resolove('删除完成'))
              }
            }).catch((err) => {
              console.log(err)
              this.fileList[v.room].push(v)
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
    }
  }
}
</script>

<style scoped lang="scss">
.upload-card ::v-deep .el-card__body {
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
  padding: 10px 5px;
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
