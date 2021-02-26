<!--
 * @Author: zfd
 * @Date: 2020-12-09 08:43:23
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:27:37
 * @Description: 审核意见
-->
<template>
  <div v-loading="pageLoading" class="app-container">
    <el-page-header content="设计稿" style="margin-bottom:30px" @back="$router.go(-1)" />
    <el-card style="margin-bottom:30px">
      <div slot="header">
        <span>基本信息</span>
      </div>
      <el-form label-width="120px" class="show-form">
        <el-form-item label="申请人">
          {{ basic.applicantName }}
        </el-form-item>
        <el-form-item label="申请时间">
          {{ basic.createTime }}
        </el-form-item>
        <el-form-item label="用户地址">
          {{ basic.address }}
        </el-form-item>
        <el-form-item label="电话">
          {{ basic.phoneNumber }}
        </el-form-item>
        <el-form-item label="加装电梯地址">
          {{ basic.location }}
        </el-form-item>
        <el-form-item v-if="basic.principalName" label="代理人">
          {{ basic.principalName }}
        </el-form-item>
        <el-form-item v-if="basic.principalName" label="代理人电话">
          {{ basic.principalPhone }}
        </el-form-item>
        <el-form-item label="设计单位">
          {{ basic.designName }}
        </el-form-item>
        <el-form-item label="设备">
          {{ basic.device }}
        </el-form-item>
        <el-form-item label="施工单位">
          {{ basic.constructionName }}
        </el-form-item>
        <el-form-item label="监理单位">
          {{ basic.supervisionName }}
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="upload-card" style="margin-bottom:30px">
      <div slot="header">
        <span>方案设计稿</span>
      </div>
      <upload-list :files="schemaList" list-type="picture-card" :disabled="true" />

    </el-card>
    <el-card class="upload-card" style="margin-bottom:30px">
      <div slot="header">
        <span>施工图设计稿</span>
      </div>
      <upload-list :files="constructionList" list-type="picture-card" :disabled="true" />

    </el-card>

  </div>
</template>

<script>
import File from '@/api/file'
import { mapState } from 'vuex'
import { notEmptyArray } from '@/utils'
export default {
  name: 'AuditDetail',
  data() {
    return {
      pageLoading: false,
      list: [],
      projectId: null,
      schemaList: [],
      constructionList: [],
      basic: {}
    }
  },
  computed: {
    ...mapState('common', ['handleTag', 'auditOptions'])
  },
  created() {
    const { id } = this.$route.params

    if (!isNaN(+id)) {
      this.projectId = id
      this.getDetail() // 获取详情
    }
  },
  methods: {
    async getDetail() {
      this.pageLoading = true
      const basicAsync = new Promise((resolve, reject) => {
        this.$store.dispatch('getProjectBasic', this.projectId)
          .then(res => {
            this.basic = res
            resolve('获取成功')
          })
          .catch(() => {
            reject('基础信息获取失败')
          })
      })
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
          .catch(() => {
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
          .catch(() => {
            reject('施工图调取失败')
          })
      })
      Promise.all([schemaAsync, constructionAsync, basicAsync])
        .then(() => (this.pageLoading = false))
        .catch(() => {
          this.pageLoading = false
          this.$message.error('信息获取失败')
        })
      this.pageLoading = false
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id } = to.params
    if (isNaN(+id)) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-card ::v-deep .el-card__body {
  text-align: center;
  margin-bottom: 30px;
}
</style>
