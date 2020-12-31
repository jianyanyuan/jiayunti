<!--
 * @Author: your name
 * @Date: 2020-10-14 09:06:05
 * @LastEditTime: 2020-12-31 10:41:34
 * @LastEditors: zfd
 * @Description: In User Settings Edit
 * @FilePath: \jiayunti\src\components\street\design\index.vue
-->
<template>
  <div v-loading="pageLoading">
    <el-tabs tab-position="left">
      <el-tab-pane label="基本信息">
        <el-card class="table-expand-public">
          <el-form label-position="left" inline class="expand-form-p">
            <el-form-item label="设计单位">
              <span>{{ design.designName }}</span>
            </el-form-item>
            <el-form-item label="时间">
              <span v-show="design.designtime">{{ new Date(design.designtime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
          <upload-list :files="schemaList" list-type="picture-card" :disabled="true" />
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="施工图设计">
        <el-card>
          <upload-list :files="constructionList" list-type="picture-card" :disabled="true" />
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import File from '@/api/file'
import { notEmptyArray } from '@/utils'
import { getDesignerApi } from '@/api/projects'
import Design from '@/api/designer'
export default {
  name: 'AuditDesign',
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
      design: {},
      pageLoading: false,
      schemaList: [],
      constructionList: []
    }
  },
  created() {
    this.detailApply()
  },
  methods: {
    detailApply() {
      this.pageLoading = true
      const infoAsync = new Promise((resolve, reject) => {
        Design.getInfo(this.id).then(res => {
          if (res) {
            this.design = res
            resolve('ok')
          }
          reject('设计单位信息获取失败')
        })
          .catch(() => {
            reject('设计单位信息获取失败')
          })
      })
      const designerAsync = new Promise((resolve, reject) => {
        getDesignerApi(this.id)
          .then(res => {
            this.design = res
            resolve('ok')
          })
          .catch(() => {
            reject('设计单位信息获取失败')
          })
      })
      const schemaAsync = new Promise((resolve, reject) => {
        File.get({ projectId: this.id, typeName: 'designer-scheme' })
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
        File.get({ projectId: this.id, typeName: 'construction-design' })
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
      Promise.all([designerAsync, schemaAsync, constructionAsync, infoAsync])
        .then(() => (this.pageLoading = false))
        .catch(() => {
          this.pageLoading = false
          this.$message.error('信息获取失败')
        })
    }
  }
}
</script>

