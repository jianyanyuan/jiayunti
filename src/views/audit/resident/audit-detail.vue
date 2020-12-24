<!--
 * @Author: zfd
 * @Date: 2020-12-24 10:04:41
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-24 10:58:27
 * @Description: 
-->
<template>
  <div class="basic-container app-container" v-loading="pageLoading">
    <el-page-header content="审核意见" style="margin-bottom:30px" @back="$router.go(-1)" />
    <el-card style="margin-bottom:30px">
      <div slot="header">
        <span style="margin-right:20px">审核信息</span>
        <el-tag :type="audit.reviewResult | keyToVal(handleTag)">{{ audit.reviewResult | keyToVal(auditOptions) }}</el-tag>
      </div>
      <el-form label-position="left" class="demo-table-expand">
        <el-form-item label="审核机构">
          <span>{{ audit.reviewOrganization }}</span>
        </el-form-item>
        <el-form-item label="机构地址：">
          <span>{{ audit.address }}</span>
        </el-form-item>
        <el-form-item label="电话：">
          <span>{{ audit.phone }}</span>
        </el-form-item>
        <el-form-item label="审核时间：">
          <span>{{ audit.auditTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </el-form-item>
        <el-form-item label="审核意见：">
          <span>{{ audit.reviewOpinion }}</span>
        </el-form-item>
        <el-form-item label="审核结果：">
          <el-tag :type="audit.reviewResult | keyToVal(handleTag)">{{ audit.reviewResult | keyToVal(auditOptions) }}</el-tag>
        </el-form-item>
        <el-form-item label="附件：">
          <upload-list :files="audit.files" list-type="picture-card" :disabled="true" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
// import mixn from '@/components/UploadList/mixin'
import Community from '@/api/community'
import { mapState } from 'vuex'
export default {
  name: 'AuditDetail',
  // mixins: [mixn],
  data() {
    return {
      pageLoading: false,
      audit: {},
      projectId: null
    }
  },
  computed: {
    ...mapState('common', ['handleTag', 'auditOptions'])
  },
  created() {
    const { id, status } = this.$route.params
    // 0申请中

    if (!isNaN(+id) && status == 0) {
      this.projectId = id
      this.getDetail() // 获取详情
    }
  },
  methods: {
    async getDetail() {
      this.pageLoading = true
      await Community.checkLatest(this.projectId).then(res => {
        res.files = new Array({ uid: Date.now(), url: res.path })
        this.audit = res
      }).catch(() => {
        this.$message.error('数据获取失败')
      })
      this.pageLoading = false
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 0申请中
    if (isNaN(+id) || status != 0) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-table-expand ::v-deep label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 20px;
  margin-bottom: 0;
  width: 100%;
}

.basic-container ::v-deep .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}

.edit-upload ::v-deep .el-upload--picture-card {
  border-style: solid;
}
</style>