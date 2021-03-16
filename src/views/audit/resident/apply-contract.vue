<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2021-03-16 09:15:15
 * @Description: 申请合同
 * @FilePath:
-->
<template>
  <div v-loading="pageLoading" class="app-container">
    <el-page-header content="申请合同" class="gap-bottom-public" @back="$router.go(-1)" />
    <template v-if="isToUpload">
      <el-upload ref="contractUpload" :file-list="contractList" action="#" :on-preview="handleContractPreview" :on-remove="isToUpload && handleUploadRemove" :on-change="handleUploadChange" list-type="picture-card" :auto-upload="false">

        <i class="el-icon-plus" />

      </el-upload>

    </template>
    <template v-else>
      <upload-list v-if="contractList.length > 0" :files="contractList" list-type="picture-card" :disabled="true" />
      <p v-else style="text-align:center"> 合同暂未上传</p>
    </template>
    <el-dialog center title="申请合同" :visible.sync="dialogImageVisible" class="dialog-center-public">
      <img :src="dialogImageUrl " alt="申请合同">
    </el-dialog>

    <el-dialog center :visible.sync="pdfVisible" class="dialog-center-public">
      <!-- 加载全部页面的PDF是一个for循环,不能指定用来打印的ref -->
      <div ref="printContent">
        <Pdf v-for="i in pdfPages" :key="i" :src="pdfURL" :page="i" />
      </div>
      <span slot="title">
        <el-button type="success" size="small" style="float:left" @click="printPDF('printContent')">打印</el-button>
        <span class="pdf-title">申请合同</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { notEmptyArray, checkUpload } from '@/utils'

import Pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'
import File from '@/api/file'
export default {
  name: 'ResidentContract',
  components: {
    Pdf
  },
  data() {
    return {
      dialogImageVisible: false,
      dialogImageUrl: '',
      pdfURL: '',
      pdfVisible: false,
      pdfPages: undefined, // pdf内容
      contractList: [],
      isToUpload: false,
      projectId: null,
      pageLoading: false

    }
  },
  computed: {
  },
  created() {
    const { id } = this.$route.params
    if (isFinite(+id)) {
      this.projectId = id
      this.getFiles()
    }
  },
  methods: {
    // 获取合同
    async getFiles() {
      this.pageLoading = true
      try {
        const { isEntrust } = await this.$store.dispatch('getProjectBasic', this.projectId)

        this.contractList = []

        if (this.$store.getters.roles[0] === 'ROLE_RESIDENT' && isEntrust === 0) {
          this.isToUpload = false
        }
        this.isToUpload = true

        const { content } = await File.get({ projectId: this.projectId, typeName: 'apply-contract' })
        if (notEmptyArray(content)) {
          for (const i of content) {
            const file = {
              uid: i.id,
              name: i.filename,
              url: i.path
            }
            if (/\bpdf/i.test(i.filename)) {
              file.url = require('@/assets/images/pdf.jpg')
              file.path = i.path
            }
            this.contractList.push(file)
          }
        }
        this.pageLoading = false
      } catch (errorMsg) {
        this.$message.error(errorMsg)
      }
    },
    // 限制了添加文件的逻辑，不支持多个文件选择
    async handleUploadChange(file, fileList) {
      const valid = checkUpload(file.raw)
      if (valid) {
        const formData = new FormData()
        formData.append('file', file.raw)
        const isPdf = /\bpdf/i.test(file.raw.type)
        if (isPdf) file.url = require('@/assets/images/pdf.jpg')
        await File.upload(formData, { projectId: this.projectId, typeName: 'apply-contract' })
          .then(res => {
            if (isPdf) {
              file.path = res.fileAddress
            } else {
              file.url = res.fileAddress
            }
            file.status = 'success'
            file.uid = res.fileTypeId
          })
          .catch(() => {
            // 上传失败
            this.$message.error('上传失败')
          })
      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList) {
      File.remove(file.uid)
        .catch(() => {
          this.$message.error('删除失败')
        })
    },

    // 合同预览
    handleContractPreview(file) {
      const url = file.path || file.url
      const isPdf = /\bpdf/i.test(file.name) || /\bpdf$/i.test(url)
      if (isPdf) {
        // 展示pdf
        this.pdfURL = Pdf.createLoadingTask(url)
        this.pdfURL.promise.then(pdf => {
          this.pdfPages = pdf.numPages
          this.pdfVisible = true
        }).catch(() => {
          this.$message.error('pdf预览失败')
        })
      } else {
        this.dialogImageUrl = file.url
        this.dialogImageVisible = true
      }
    },
    // 打印pdf
    printPDF(refName) {
      html2canvas(this.$refs[refName], {
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
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id } = to.params
    if (isFinite(+id)) {
      next()
    } else {
      next('/redirect' + from.fullPath)
    }
  }
}
</script>

<style scoped>
.basic-container /deep/ .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}
.expand-form-p /deep/ label {
  width: 100px;
  color: #99a9bf;
}
.expand-form-p .el-form-item {
  margin-left: 20px;
  margin-bottom: 0;
  width: 100%;
}
</style>

