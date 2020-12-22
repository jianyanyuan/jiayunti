<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-15 14:19:44
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\card\index.vue
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>设计信息</span>
        </div>
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="设计单位">
            <span>{{ design.org }}</span>
          </el-form-item>
          <el-form-item label="时间">
            <span>{{ design.time }}</span>
          </el-form-item>
          <el-form-item label="详细地址">
            <span>{{ design.address }}</span>
          </el-form-item>
          <el-form-item label="电话">
            <span>{{ design.phone }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card class="basic-container" style="margin-bottom:30px">
      <div slot="header">
        <span>施工图设计稿</span>
      </div>
      <upload-list :files="files" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />
    </el-card>

    <Audit :id="projectId" :status="status" />
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
import Audit from '@/components/street/Audit'
import mixn from '@/components/UploadList/mixin'
import File from '@/api/file'
import { notEmptyArray } from '@/utils'
export default {
  name: 'DrawingCheck',
  mixins: [mixn],
  components: {
    Audit
  },
  data() {
    return {
      projectId: null,
      status: null,
      files: [],
      pageLoading: false,
      design: {
        org: '建研院',
        time: '2020-10-12 10:56',
        address: '苏州高新区',
        phone: '15988800323'
      }
    }
  },
  created() {
    const { id, status } = this.$route.params
    //3第二次提交材料
    if (!isNaN(+id) && status == 7) {
      this.projectId = id
      this.status = status
      this.detailApply()
    }
  },
  methods: {
    detailApply() {
      this.pageLoading = true
      File.get({ projectId: this.projectId, typeName: 'construction-design' })
        .then(res => {
          if (notEmptyArray(res.content)) {
            for (const i of res.content) {
              this.files.push({
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
        .finally(() => {
          this.pageLoading = false
        })
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    //3第二次提交材料
    const illegal = isNaN(+id) || status != 7

    if (illegal) {
      next('/redirect' + from.fullPath)
    }
    next()
  }
}
</script>

<style scoped>


.demo-table-expand /deep/ label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 20px;
  margin-bottom: 0;
  width: 100%;
}

.basic-container /deep/ .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}


.audit-operation {
  width: 200px;
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
</style>

