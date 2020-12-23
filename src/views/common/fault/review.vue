<!--
 * @Author: zfd
 * @Date: 2020-11-02 14:20:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-23 09:13:46
 * @Description:
-->
<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-11-02 13:53:39
 * @Description: 施工端违规处理
 * @FilePath: \vue-admin-template\src\views\collapse\index.vue
-->
<template>
  <div class="app-container" v-loading="pageLoading">
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
          <el-tag :type="item.status  | keyToVal(handleTag)" style="margin-left:20px">{{ item.status | keyToVal(handleFault) }}</el-tag>
        </template>
        <!-- <div>
          建议人：{{ item.name }}
          <el-tag :type="item.status | keyToVal(handleTag)">{{ item.status | keyToVal(handleStatus) }}</el-tag>
        </div> -->
        <el-form :model="list[index]" :rules="rule" label-width="120px" class="handle-form">
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
            <el-date-picker v-model="item.time" disabled format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
          <el-form-item label="违规描述:">
            <el-input v-model="item.description" disabled />
          </el-form-item>
          <el-form-item label="违规照片:">
            <upload-list :files="item.illegalFile.map(f =>({uid:f.id,name: f.filename, url: f.path }))" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />
          </el-form-item>
          <el-form-item label="违规回复:" v-if="item.status !== -1">
            <el-input v-model="item.response" disabled />
          </el-form-item>
          <el-form-item label="整改照片:" v-if="item.status !== -1">
            <upload-list :files="item.rectificationFile.map(f => ({uid:f.id,name: f.filename, url: f.path }))" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />

          </el-form-item>
          <el-form-item label="处理回复:" prop="toResponse" v-if="item.status !== -1">
            <el-input v-model="item.toResponse" type="textarea" autosize :disabled="item.status=== 0" />
          </el-form-item>
          <el-form-item label="处理结果:" prop="result" v-if="item.status !== -1">
            <el-select v-model="item.result" :disabled="item.status=== 0">
              <el-option v-for="result in auditOptions" :key="result.val" :value="result.key" :label="result.val" />
            </el-select>
          </el-form-item>
          <el-row type="flex" justify="center" style="margin:50px 0">
            <el-button type="primary" @click="handlePost" v-if="item.status === 2 || item.status === 1">保 存</el-button>
            <!-- <el-button @click="$router.go(-1)">返 回</el-button> -->
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-dialog center title="图片详情" :visible.sync="imgVisible" :close-on-click-modal="false" class="dialog-center">
      <img :src="detailImgUrl" alt="授权委托书">
    </el-dialog>
    <el-dialog title="pdf预览" center :visible.sync="pdfVisible" :close-on-click-modal="false" class="dialog-center">
      <!-- 加载全部页面的PDF是一个for循环,不能指定用来打印的ref -->
      <div ref="printContent">
        <Pdf v-for="i in pdfPages" :key="i" :src="pdfURL" :page="i" />
      </div>
      <span slot="footer">
        <el-button @click="printPDF" type="success">打印</el-button>
        <!-- <el-button type="primary" @click="printImg">转图片打印</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import mixin from '@/components/UploadList/mixin'
import Supervision from '@/api/supervision'
import Construction from '@/api/construction'

import { notEmptyArray } from '@/utils'
export default {
  name: 'FaultReview',
  mixins: [mixin],
  data() {
    return {
      picShow: false,
      pageLoading: false,
      construction: {},
      rule: {
        result: [{ required: true, message: '请选择处理结果' }],
        toResponse: [{ required: true, message: '请输入处理回复' }]
      },
      list: [],
      projectId: null,
      status: null,
      fromPath: null,
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
    ...mapState('common', ["auditOptions"])
  },
  created() {
    const { id, status } = this.$route.query
    //11 施工中
    if (!isNaN(+id) && status == 11) {
      this.projectId = id
      this.status = status
      this.listFaults()
    }
  },
  methods: {
    listFaults() {
      this.pageLoading = true
      const faultAsync = new Promise((resolve, reject) => {
        Supervision.getFault(this.projectId).then(res => {
          if (notEmptyArray(res)) {
            res = res.filter(v => v.createdBy == this.$store.getters.userid)
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
          }
          this.list = res
          resolve('ok')

        }).catch(() => {
          reject('异议获取失败')

        })
      })
      const infoAsync = new Promise((resolve, reject) => {
        Construction.getInfo(this.projectId).then(res => {
          if (!res) {
            this.construction = res
            resolve('ok')
          }
          reject('施工单位单位信息获取失败')
        })
          .catch((err) => {
            reject('施工单位单位信息获取失败')
          })
      })
      Promise.all([faultAsync, infoAsync])
        .catch((err) => {
          console.log(err)
          this.$message.error('信息获取失败')
        })
        .finally(() => {
          this.pageLoading = false
        })

    },
    handlePost() {
      const data = this.list.filter(v => v.response).map(v => ({ id: v.id, result: v.result, toResponse: v.toResponse }))
      this.pageLoading = true
      Supervision.faultReply(data)
        .then(() => {
          this.listFaults()
        })
        .catch(() => {
          this.$message.error('提交失败')
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
    if (isNaN(+id) || status != 11) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next(vm => {
        vm.fromPath = from.fullPath
      })
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

