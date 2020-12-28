<!--
 * @Author: zfd
 * @Date: 2020-10-30 14:33:26
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-28 15:38:45
 * @Description: 居民查看设计图
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-page-header content="设计图" @back="$router.go(-1)" />

    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>设计信息</span>
        </div>
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="设计单位">
            <span>{{ design.designName }}</span>
          </el-form-item>
          <el-form-item label="时间">
            <span v-show="design.designtime">{{ new Date(design.designtime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
        <span>方案设计稿</span>
      </div>
      <upload-list :files="files" list-type="picture-card" :disabled="true" />
    </el-card>
  </div>
</template>

<script>
import File from '@/api/file'
import Design from '@/api/designer'
export default {
  name: 'AuditDetail',

  data() {
    return {
      projectId: null,
      status: null,
      files: [],
      pageLoading: false,
      design: {}

    }
  },
  created() {
    const { id, status } = this.$route.params
    //7 施工图审核
    if (!isNaN(+id) && status == 7) {
      this.projectId = id
      this.status = status
      this.detailApply()
    }
  },
  methods: {
    detailApply() {
      this.pageLoading = true
      const fileAsync = new Promise((resolve, reject) => {
        File.get({ projectId: this.projectId, typeName: 'construction-design' })
          .then(res => {
            this.files = []
            if (notEmptyArray(res.content)) {
              for (const i of res.content) {
                this.files.push({
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
            reject('附件获取失败')
          })
      })
      const infoAsync = new Promise((resolve, reject) => {
        Design.getInfo(this.projectId).then(res => {
          if (res) {
            this.design = res
            resolve('ok')
          }
          reject('设计单位信息获取失败')
        })
          .catch((err) => {
            reject('设计单位信息获取失败')
          })
      })
      Promise.all([fileAsync, infoAsync])
        .catch((err) => {
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
    //7 施工图审核
    const illegal = isNaN(+id) || status != 7

    if (illegal) {
      next('/redirect' + from.fullPath)
    }
    next()
  }

}
</script>
<style scoped>
.basic-container /deep/ .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}
.demo-table-expand /deep/ label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 20px;
  margin-bottom: 0;
  width: 100%;
}
</style>
