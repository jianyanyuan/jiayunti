<!--
 * @Author: zfd
 * @Date: 2020-11-02 14:20:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-21 09:50:55
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
            {{ basic.name }}
          </el-form-item>
          <el-form-item label="地址：">
            {{ basic.address }}
          </el-form-item>
          <el-form-item label="电话：">
            {{ basic.phone }}
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-collapse>
      <el-collapse-item v-for="(item, index) in list" :key="index">
        <template slot="title">
          监管单位：{{ item.submitter }}
          <el-tag :type="item.response ? 0:1  | keyToVal(handleTag)" style="margin-left:20px">{{ item.response ? 0:1 | keyToVal(handleFault) }}</el-tag>
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
          <el-form-item label="违规回复:">
            <el-input v-model="item.response" disabled v-if="item.response" />
          </el-form-item>
          <el-form-item label="整改照片:">
            <upload-list :files="item.rectificationFile.map(f => ({uid:f.id,name: f.filename, url: f.path }))" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />

          </el-form-item>
          <el-form-item label="处理回复:" prop="toResponse">
            <el-input v-model="item.toResponse" type="textarea" autosize v-if="item.response" />
          </el-form-item>
          <el-form-item label="处理结果:" prop="result">
            <el-select v-model="item.result" v-if="item.response">
              <el-option v-for="result in auditOptions" :key="result.val" :value="result.key" :label="result.val" />
            </el-select>
          </el-form-item>
          <el-row type="flex" justify="center" style="margin:50px 0">
            <el-button type="primary" @click="handlePost">保 存</el-button>
            <el-button @click="$router.go(-1)">返 回</el-button>
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
import { notEmptyArray } from '@/utils'
export default {
  name: 'FaultReview',
  mixins: [mixin],
  data() {
    return {
      picShow: false,
      basic: {
        name: '李先生',
        address: 'dsadasdsad',
        phone: '15988800323'
      },
      pageLoading: false,
      construction: [
        {
          org: '中一建',
          code: '马家浜1号楼',
          phone: '110',
          time: '2020-01-01 10:00',
          desc: '违规操作',
          descPic: [{ name: '违规图片1', url: '' }],
          feedback: '接受批评',
          feedbackPic: [{ name: '回复照片1', url: '' }],
          descResult: '',
          result: 0,
          status: 0
        }
      ],
      rule: {
        result: [{ required: true, message: '请选择处理结果' }],
        toResponse: [{ required: true, message: '请输入处理回复' }]
      },
      list: [],
      projectId: null,
      status: null,
      fromPath: null
    }
  },
  computed: {
    ...mapState('common', ['handleFault', 'handleTag', "auditOptions"])
  },
  created() {
    const { id, status } = this.$route.params
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
      Supervision.getFault(this.projectId).then(res => {
        this.list = res.filter(v => v.createdBy == this.$store.getters.userid)
      }).catch(() => {
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
          this.$router.push(this.fromPath)
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
    const { id, status } = to.params
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

