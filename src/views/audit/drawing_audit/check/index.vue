<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-31 10:36:50
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\card\index.vue
-->
<template>
  <div v-loading="pageLoading" class="app-container">
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>设计信息</span>
        </div>
        <el-form label-position="left" inline class="expand-form-p">
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
        <span>施工图设计稿</span>
      </div>
      <upload-list :files="files" list-type="picture-card" :disabled="true" />
    </el-card>

    <Audit :id="projectId" :status="status" />
  </div>
</template>

<script>
import Audit from '@/components/street/Audit'
import File from '@/api/file'
import Design from '@/api/designer'

import { notEmptyArray } from '@/utils'
export default {
  name: 'DrawingCheck',
  components: {
    Audit
  },
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
    // 3第二次提交材料
    if (!isNaN(+id) && +status === 7) {
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
          .catch(() => {
            reject('附件获取失败')
          })
      })
      const infoAsync = new Promise((resolve, reject) => {
        Design.getInfo(this.projectId).then(res => {
          if (res) {
            this.design = res
            resolve('ok')
          } else {
            reject('设计单位信息获取失败')
          }
        })
          .catch(() => {
            reject('设计单位信息获取失败')
          })
      })
      Promise.all([fileAsync, infoAsync])
        .catch(() => {
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
    // 3第二次提交材料
    const illegal = isNaN(+id) || +status !== 7

    if (illegal) {
      next('/redirect' + from.fullPath)
    }
    next()
  }
}
</script>

<style scoped>
.expand-form-p /deep/ label {
  width: 100px;
  color: #99a9bf;
}
.expand-form-p .el-form-item {
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

