<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-31 11:28:05
 * @Description: 施工端违规处理
 * @FilePath: \vue-admin-template\src\views\collapse\index.vue
-->
<template>
  <div v-loading="pageLoading" class="app-container">
    <el-page-header content="违规查看" style="margin-bottom:30px" @back="$router.go(-1)" />

    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>施工单位信息</span>
        </div>
        <el-form label-width="120px" class="show-form">
          <el-form-item label="施工单位：">
            {{ construction.constructionName }}
          </el-form-item>
          <el-form-item label="地址：">
            {{ construction.address }}
          </el-form-item>
          <el-form-item label="电话：">
            {{ construction.phone }}
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-collapse>
      <el-collapse-item v-for="(item, index) in list" :key="index">
        <template slot="title">
          监管单位：{{ item.submitter }}
          <el-tag :type="item.status | keyToVal(handleTag)" style="margin-left:20px">{{ item.status | keyToVal(handleFault) }}</el-tag>
        </template>
        <!-- <div>
          建议人：{{ item.name }}
          <el-tag :type="item.status | keyToVal(handleTag)">{{ item.status | keyToVal(handleStatus) }}</el-tag>
        </div> -->
        <el-form :model="list[index]" label-width="120px" class="handle-form">
          <el-form-item label="申请编号:">
            <el-input v-model="item.projectName" disabled />
          </el-form-item>
          <el-form-item label="监管单位:">
            <el-input v-model="item.submitter" disabled />
          </el-form-item>
          <el-form-item label="联系电话:">
            <el-input v-model="item.phone" disabled />
          </el-form-item>
          <el-form-item label="违规时间:">
            <el-input v-model="item.time" disabled />
          </el-form-item>
          <el-form-item label="违规描述:">
            <el-input v-model="item.description" disabled />
          </el-form-item>
          <el-form-item label="违规照片:">
            <upload-list :files="item.illegalFile.map(f =>({uid:f.id,name: f.filename, url: f.path }))" list-type="picture-card" :disabled="true" />

          </el-form-item>
          <el-form-item label="违规回复:">
            <el-input v-if="item.status !== -1" v-model="item.response" disabled />
          </el-form-item>
          <el-form-item label="整改照片:">
            <upload-list v-if="item.status !== -1" :files="item.rectificationFile.map(f => ({uid:f.id,name: f.filename, url: f.path }))" list-type="picture-card" :disabled="true" />

          </el-form-item>
          <el-form-item v-if="item.status === 0 || item.status === 1" label="处理回复:">
            <el-input v-if="item.toResponse" v-model="item.toResponse" type="textarea" autosize disabled />
          </el-form-item>
          <el-form-item v-if="item.status === 0 || item.status === 1" label="处理结果:">
            <el-select v-if="item.toResponse" v-model="item.result" disabled>
              <el-option v-for="result in auditOptions" :key="result.val" :value="result.key" :label="result.val" disabled />
            </el-select>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div v-if="list.length === 0" class="empty-content-public">暂无违规记录</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Supervision from '@/api/supervision'
import Construction from '@/api/construction'

export default {
  name: 'FaultView',
  data() {
    return {
      construction: {},
      list: [],
      pageLoading: false,
      projectId: null,
      status: null,
      handleFault: [
        { key: -1, val: '未整改' },
        { key: 0, val: '整改通过' },
        { key: 1, val: '整改未通过' },
        { key: 2, val: '未回复' }
      ],
      handleTag: [
        { key: -1, val: 'info' },
        { key: 0, val: 'success' },
        { key: 1, val: 'danger' },
        { key: 2, val: 'warning' }
      ]
    }
  },
  computed: {
    ...mapState('common', ['auditOptions'])
  },
  created() {
    const { id, status } = this.$route.query
    // 11 施工中
    if (!isNaN(+id) && +status === 11) {
      this.projectId = id
      this.status = status
      this.listFaults()
    }
  },
  methods: {
    listFaults() {
      this.pageLoading = true
      const infoAsync = new Promise((resolve, reject) => {
        Construction.getInfo(this.projectId).then(res => {
          if (res) {
            this.construction = res
            resolve('ok')
          } else {
            reject('施工单位单位信息获取失败')
          }
        })
          .catch(() => {
            reject('施工单位单位信息获取失败')
          })
      })
      const faultAsync = new Promise((resolve, reject) => {
        Supervision.getFault(this.projectId).then(res => {
          res.forEach(v => {
            if (!v.response) {
              v.status = -1 // 未整改
            } else {
              // 已整改
              if (v.toResponse === undefined) {
                v.status = 2 // 整改未回复
              } else {
                v.status = v.result // 整改结果
              }
            }
          })
          resolve('ok')
          this.list = res
        }).catch(() => {
          reject('异议获取失败')
        })
      })
      Promise.all([faultAsync, infoAsync])
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
    const { id, status } = to.query
    // 11 施工中
    if (isNaN(+id) || +status !== 11) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  }
}
</script>

<style scoped lang="scss">
.basic-container ::v-deep .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}
.head {
  height: 30px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  margin-bottom: 30px;
}
.dialog-image {
  text-align: center;
  img {
    width: 100%;
  }
}
.form-card ::v-deep .el-upload-dragger {
  width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
</style>

