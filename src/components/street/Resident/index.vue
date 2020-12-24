<template>
  <div>
    <el-tabs tab-position="left" v-loading="tabLoading">
      <el-tab-pane label="基本资料">
        <el-card class="expand-info">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="申请人">
              {{ basic.applicantName }}
            </el-form-item>
            <el-form-item label="申请时间">
              {{ basic.createTime }}
            </el-form-item>
            <el-form-item label="地址">
              {{ basic.address }}
            </el-form-item>
            <el-form-item label="电话">
              {{ basic.phoneNumber }}
            </el-form-item>
            <el-form-item label="加装电梯地址">
              {{ basic.location }}
            </el-form-item>
            <el-form-item label="设计单位">
              {{ basic.designName }}
            </el-form-item>
            <el-form-item label="设备">
              {{ basic.device }}
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="意见征询表">
        <el-card v-for="(room) in rooms" :key="room" class="upload-card" style="margin-bottom:30px">
          <div slot="header">
            <span>{{ room }}</span>
          </div>
          <upload-list :files="fileList[room]" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane v-for="item in pageContent" :key="item.label" :label="item.label">
        <el-card>
          <upload-list :files="item.fileList" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog center title="图片详情" :visible.sync="imgVisible"  class="dialog-center-public">
      <img :src="detailImgUrl" alt="意见咨询表">
    </el-dialog>

    <el-dialog center :visible.sync="pdfVisible"  class="dialog-center-public">
      <!-- 加载全部页面的PDF是一个for循环,不能指定用来打印的ref -->
      <div ref="printContent">
        <Pdf v-for="i in pdfPages" :key="i" :src="pdfURL" :page="i" />
      </div>
      <span slot="title">
        <el-button @click="printPDF('printContent')" type="success" style="float:left">打印</el-button>
        <span>pdf预览</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import File from '@/api/file'
import Pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'
import { notEmptyArray } from '@/utils'
export default {
  name: 'AuditMaterial',
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
  components: {
    Pdf
  },
  data() {
    return {
      pdfURL: require('@/assets/images/pdf.jpg'),
      tabLoading: false,
      basic: {},// 基础信息
      imgVisible: false,
      pdfVisible: false,
      detailImgUrl: '',
      pdfURL: '', // Pdf路径
      pdfPages: undefined,// pdf内容
      rooms: [],// 意见征询表
      fileList: {}, // 意见征询表
      pageContent: [
        {
          label: '意见征询汇总表',
          fileList: []
        },
        {
          label: '委托授权书',
          fileList: []
        },
        {
          label: '项目协议书',
          fileList: []
        },
        {
          label: '专用账户授权委托书',
          fileList: []
        }
      ]
    }
  },
  created() {
    this.getInformation()
  },
  methods: {
    // 获取信息
    getInformation() {
      this.tabLoading = true
      const asyncReq = []
      const basicAsync = this.$store.dispatch('getProjectBasic', this.id)
        .then(res => {
          this.basic = res
        })
      asyncReq.push(basicAsync)
      const consultationAsync = File.getConsultation({ projectId: this.id })
        .then(res => {
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
        })
      asyncReq.push(consultationAsync)

      const typeMap = ['consultation-summary', 'delegate-form', 'protocal-form', 'special-form']
      // 9街道审核
      if (this.status == 9) {
        typeMap.push('notice-content', 'notice-report')
        this.pageContent.push({
          label: '公示内容',
          fileList: []
        },
          {
            label: '公示报告',
            fileList: []
          })
      }

      for (let idx = 0; idx < typeMap.length; idx++) {
        const fileAsync = File.get({ projectId: this.id, typeName: typeMap[idx] })
          .then(res => {
            if (notEmptyArray(res.content)) {
              for (const i of res.content) {
                this.pageContent[idx].fileList.push({
                  uid: i.id,
                  name: i.filename,
                  url: i.path
                })
              }
            }
          })
        asyncReq.push(fileAsync)
      }
      Promise.all(asyncReq).then(() => (this.tabLoading = false)).catch(err => {
        console.log(err)
        this.tabLoading = false
        this.$message.error('信息获取失败')
      })
    },
    // 打印pdf
    printPDF(ref) {
      html2canvas(this.$refs[ref], {
        backgroundColor: null,
        useCORS: true,
        windowHeight: 0
      }).then((canvas) => {
        const url = canvas.toDataURL()
        printJS({
          printable: url,
          type: 'image',
          documentTitle: this.printName
        })
      })
    },
    // 展示文件
    detailFile(file) {
      if (/\bpdf/i.test(file.name)) {
        // 展示pdf
        this.pdfURL = Pdf.createLoadingTask(file.url)
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

    }
  }
}
</script>

<style scoped>
.expand-info .demo-table-expand ::v-deep label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 150px;
  margin-bottom: 0;
  width: 100%;
}
</style>
