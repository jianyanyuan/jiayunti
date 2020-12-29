<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-29 09:11:40
 * @Description: 居民异议反馈查看
 * @FilePath: \vue-admin-template\src\views\collapse\index.vue
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-page-header content="异议反馈" style="margin-bottom:50px" @back="$router.go(-1)" />
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
            <span v-show="design.designtime">{{ new Date(design.designtime) |parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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

    <el-collapse>
      <el-collapse-item v-for="(item, index) in objection" :key="index">
        <template slot="title">
          建议人：{{ item.adviceName }}
          <el-tag :type="item.result | keyToVal(handleTag)" style="margin-left:20px">{{ item.result | keyToVal(checkOptions) }}</el-tag>
        </template>
        <el-form label-width="120px" class="center-form">
          <el-form-item label="时间：">
            {{ new Date(item.time) | parseTime('{y}-{m}-{d} {h}-{i}')}}
          </el-form-item>
          <el-form-item label="联系方式：">
            {{ item.phoneNumber }}
          </el-form-item>
          <el-form-item label="详细地址：">
            {{ item.address }}
          </el-form-item>
          <el-form-item label="异议详情：">
            {{ item.objection }}
          </el-form-item>
          <el-form-item label="异议反馈：">
            {{ item.toObjection }}
          </el-form-item>
          <el-form-item label="处理结果：">
            {{ item.result | keyToVal(checkOptions) }}
          </el-form-item>
        </el-form>

      </el-collapse-item>
    </el-collapse>
    <div class="empty-content-public" v-if="objection.length === 0">暂无异议</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Community from '@/api/community'
import File from '@/api/file'
import Design from '@/api/designer'
import { notEmptyArray } from '@/utils'
export default {
  name: 'Assents',
  data() {
    return {
      pageLoading: false,
      objection: [],
      projectId: null,
      status: null,
      files: [],
      design: {}

    }
  },
  computed: {
    ...mapState('common', ['checkOptions', 'handleTag'])
  },
  created() {
    const { id, status } = this.$route.params
    // 3异议查看
    if (!isNaN(+id) && status == 3) {
      this.projectId = id
      this.status = status
      this.detailApply()
    }
  },
  methods: {
    detailApply() {
      this.pageLoading = true
      const fileAsync = new Promise((resolve, reject) => {
        // 方案设计稿
        File.get({ projectId: this.projectId, typeName: 'designer-scheme' })
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
          .catch(err => {
            reject('方案获取失败')
          })
      })
      const objectionAsync = new Promise((resolve, reject) => {
        Community.listObjection(this.projectId)
          .then(res => {
            if (notEmptyArray(res)) {
              this.objection = res
            }
            resolve('ok')
          })
          .catch((err) => {
            console.log(err)
            reject('异议获取失败')
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
          .catch((err) => {
            reject('设计单位信息获取失败')
          })
      })
      Promise.all([fileAsync, objectionAsync, infoAsync])
        .catch((err) => {
          console.log(err)
          this.$message.error('信息获取失败')
        })
        .finally(() => {
          this.pageLoading = false
        })

    },
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 公示阶段，异议查看
    if (isNaN(+id) || status != 3) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
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

