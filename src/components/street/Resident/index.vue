<template>
  <div>
    <el-tabs tab-position="left" :before-leave="handleSwitch" v-loading="tabLoading">
      <el-tab-pane label="基本资料" name="basic">
        <el-card class="expand-info">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="申请人">
              <span>{{ apply.name }}</span>
            </el-form-item>
            <el-form-item label="详细地址">
              <span>{{ apply.address }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ apply.phone }}</span>
            </el-form-item>
            <el-form-item label="加装电梯地址">
              <span>{{ apply.liftAddress }}</span>
            </el-form-item>
            <el-form-item label="设备规格">
              <span>{{ apply.spec }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="意见征询表" name="conclutationForm">
        <el-card>
          <ul>
            <li v-for="file in conclutationForm" :key="file.id" style="text-align:center">
              <div v-if="file.type === 'pdf'" :ref="pdf + file.id" @click="printPDF(pdf + file.id)">
                <Pdf v-for="i in file.pdfPages" :key="i" :src="file.pdfURL" :page="i" />
              </div>
              <el-image v-else-if="file.type === 'pdfError'" :src="pdfURL"></el-image>
              <el-image v-else :src="file.url"></el-image>
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="意见征询汇总表" name="summaryForm">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="委托授权书" name="delegateForm">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="项目协议书" name="protocalForm">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="账户授权委托书" name="special">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane v-if="params.status == 3" label="公示内容" name="noticeContent">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane v-if="params.status == 3" label="公示报告" name="noticeReport">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Project from '@/api/projects'
import File from '@/api/file'
import Pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'
export default {
  name: 'Material',
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
      basic: undefined,
      conclutationForm: undefined,
      summaryForm: undefined,
      delegateForm: undefined,
      protocalForm: undefined,
      special: undefined,
      noticeContent: undefined,
      noticeReport: undefined,
    }
  },
  created() { },
  methods: {
    handleSwitch(to, from) {
      if (this[to]) {
        return true
      }
      this.tabLoading = true
      if (to === 'basic') {
        this.tabLoading = true
        this.$store.dispatch('getProjectBasic')
          .then(res => {
            this.basic = res
            this.tabLoading = false
          })
          .catch(() => {
            this.tabLoading = false
            this.$message.error('信息获取失败')
          })
      } else {
        const typeMap = new Map([
          ['conclutationForm', 0],
          ['summaryForm', 1],
          ['summaryForm', 2],
          ['delegateForm', 3],
          ['protocalForm', 4],
          ['special', 5],
          ['noticeContent', 6],
          ['noticeReport', 7]
        ])
        File.get({ projectId: this.id, typeId: typeMap.get(to) }).then(res => {
          if (notEmptyArray(res.content)) {
            for (const i of res.content) {
              if (i.fileName.includes(pdf)) {
                // pdf文件
                const obj = {
                  uid: i.id,
                  name: i.fileName,
                  url: i.path,
                  type: 'pdf'
                }
                const pdfURL = Pdf.createLoadingTask('/teat.pdf')
                pdfURL.promise.then(pdf => {
                  obj.pdfPages = pdf.numPages
                  obj.pdfURL = pdfURL
                  this[to].push(obj)
                }).catch(() => {
                  obj.type = 'pdfError'
                  this[to].push(obj)
                  this.$message.error('pdf无法预览')
                })

              } else {
                // image文件
                this[to].push({
                  uid: i.id,
                  name: i.fileName,
                  url: i.path,
                  type: 'image'
                })
              }

            }
          }
          this.tabLoading = false
        }).catch(err => {
          console.log(err)
          this.$message.error('信息获取失败')
          this.tabLoading = false
        })
      }
    },
    // 打印pdf
    printPDF(ref) {
      html2canvas(this.$refs[ref], {
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
      })
    },
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
