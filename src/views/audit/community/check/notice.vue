<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-16 15:04:48
 * @Description: 公示/公告审核
-->
<template>
  <div class="app-container" v-loading="pageLoading">
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>公示内容</span>
        </div>
        <upload-list :files="contentList" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />

      </el-card>
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>公示公告</span>
        </div>
        <upload-list :files="reportList" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />
      </el-card>
      <Audit :id="projectId" :status="status" v-if="conflict !== null" :conflict="conflict" />
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
import Community from '@/api/community'
import Audit from '@/components/street/Audit'
export default {
  name: 'ApplyNotice',
  components: {
    Pdf,
    Audit
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
      dirName: ['notice-content', 'notice-report'],
      projectId: null, // 工程id
      status: null, // 工程阶段标识位
      conflict: null // 异议冲突
    }
  },

  computed: {
  },
  watch: {

  },
  created() {
    const { id, status } = this.$route.params
    //3第二次提交材料
    if (!isNaN(+id) && status == 4) {
      this.projectId = id
      this.status = status
      this.detailApply()
      this.getObjection()
    }
  },
  methods: {
    // 获取已上传的意见征询表
    detailApply() {
      this.pageLoading = true
      this.contentList = []
      this.reportList = []
      this.uploadList = []
      this.deleteList = []
      this.dirName.forEach(async (v, i) => {
        await File.get({ projectId: this.projectId, typeName: v })
          .then(res => {
            if (notEmptyArray(res.content)) {
              const arr = i === 0 ? 'contentList' : 'reportList'
              for (const i of res.content) {
                this[arr].push({
                  uid: i.id,
                  name: i.filename,
                  url: i.path
                })
              }
            }
          })
          .catch(err => {
            console.log(err)
            this.$message.error('信息获取失败')
          })
      })
      this.pageLoading = false
    },
    getObjection() {
      Community.listObjection(this.projectId)
        .then(res => {
          if (Array.isArray(res)) {
            const idx = res.findIndex(v=> v.result == 1)
            if(idx !== -1) {
              this.conflict = true
            }else {
              this.conflict = false
            }
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('信息获取失败')
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

  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    //3第二次提交材料
    const illegal = isNaN(+id) || status != 4

    if (illegal) {
      next('/redirect' + from.fullPath)
    }
    next()
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
