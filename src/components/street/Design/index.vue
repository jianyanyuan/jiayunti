<!--
 * @Author: your name
 * @Date: 2020-10-14 09:06:05
 * @LastEditTime: 2020-12-16 10:36:00
 * @LastEditors: zfd
 * @Description: In User Settings Edit
 * @FilePath: \jiayunti\src\components\street\design\index.vue
-->
<template>
  <div v-loading="pageLoading">
    <el-tabs tab-position="left">
      <el-tab-pane label="基本信息">
        <el-card class="expand-info">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="设计单位">
              <span>{{ design.org }}</span>
            </el-form-item>
            <el-form-item label="时间">
              <span>{{ design.time }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ design.phone }}</span>
            </el-form-item>
            <el-form-item label="详细地址">
              <span>{{ design.address }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="设计方案">
        <el-card>
          <upload-list :files="schemaList" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="施工图设计">
        <el-card>
          <upload-list :files="constructionList" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <el-dialog center title="图片详情" :visible.sync="imgVisible" :close-on-click-modal="false" class="dialog-center">
      <img :src="detailImgUrl" alt="意见咨询表">
    </el-dialog>

    <el-dialog title="pdf预览" center :visible.sync="pdfVisible" :close-on-click-modal="false" class="dialog-center">
      <!-- 加载全部页面的PDF是一个for循环,不能指定用来打印的ref -->
      <div ref="printContent">
        <Pdf v-for="i in pdfPages" :key="i" :src="pdfURL" :page="i" />
      </div>
      <span slot="footer">
        <el-button @click="printPDF('printContent')" type="success">打印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixn from '@/components/UploadList/mixin'
import File from '@/api/file'
import { notEmptyArray } from '@/utils'
export default {
  name: 'AuditDesign',
  mixins: [mixn],
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
  data() {
    return {
      design: {
        org: '建研院',
        time: '2020-10-12 10:56',
        address: '苏州高新区',
        phone: '15988800323'
      },
      pageLoading: false,
      schemaList:[],
      constructionList:[]
    }
  },
  created() {
    this.detailApply()
  },
  methods: {
    detailApply() {
      this.pageLoading = true
      const schemaAsync = new Promise((resolve, reject) => {
        File.get({ projectId: this.projectId, typeName: 'designer-scheme' })
          .then(res => {
            if (notEmptyArray(res.content)) {
              for (const i of res.content) {
                this.schemaList.push({
                  uid: i.id,
                  name: i.filename,
                  url: i.path
                })
              }
            }
            resolve('ok')
          })
          .catch(err => {
            console.log(err)
            reject('方案设计调取失败')
          })
      })
      const constructionAsync = new Promise((resolve, reject) => {
        File.get({ projectId: this.projectId, typeName: 'construction-design' })
          .then(res => {
            if (notEmptyArray(res.content)) {
              for (const i of res.content) {
                this.constructionList.push({
                  uid: i.id,
                  name: i.filename,
                  url: i.path
                })
              }
            }
            resolve('ok')
          })
          .catch(err => {
            console.log(err)
            reject('施工图调取失败')
          })
      })
      Promise.all([schemaAsync,constructionAsync])
      .then(()=>(this.pageLoading = false))
      .catch(err => {
        this.pageLoading = false
        this.$message.error('信息获取失败')
      })
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
