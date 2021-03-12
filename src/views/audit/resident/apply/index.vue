<!--
 * @Author: your name
 * @Date: 2020-10-13 16:22:14
 * @LastEditTime: 2020-12-31 11:30:55
 * @LastEditors: zfd
 * @Description: resident apply
 * @FilePath: \jiayunti\src\views\street\audit\index.vue
-->
<template>
  <div class="app-container">
    <div class="line-divider" />
    <!-- @click="change($event)" -->
    <el-button v-if="audit" @click="dialogVisible = true">审核意见</el-button>
    <div class="step-btn-group">
      <div v-for="(item,index) in stepBtnGroup" :key="item" class="stepBtn" :step-index="index" :class="{'step-actived': curStep === index}">
        {{ item }}
      </div>
    </div>
    <div class="line-divider" />

    <div class="dynamic-component-container">
      <keep-alive>
        <component :is="curComponent" v-if="projectId" :id="projectId" :status="status" @nextProcess="handleProcess" />
      </keep-alive>
    </div>
    <el-dialog v-el-drag-dialog title="审核意见" :visible.sync="dialogVisible" :close-on-click-modal="false" width="600px" top="10vh">
      <el-form v-if="audit" label-position="left" class="expand-form-p">
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
          <span>{{ new Date(audit.auditTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
    </el-dialog>
  </div>
</template>

<script>
import Community from '@/api/community'
import { mapState } from 'vuex'

import Basic from './components/basic.vue'
import ConsultationForm from './components/consultation-form.vue'
import SummaryForm from './components/summary-form.vue'
import DelegateForm from './components/delegate-form.vue'
import ProtocalForm from './components/protocal-form.vue'
import SpecialForm from './components/special-form.vue'
import OthersForm from './components/others-form'
export default {
  name: 'ResidentApply',
  components: {
    Basic,
    ConsultationForm,
    SummaryForm,
    DelegateForm,
    ProtocalForm,
    SpecialForm,
    OthersForm
  },
  data() {
    return {
      audit: null,
      projectId: null,
      stepBtnGroup: ['基本资料', '意见征询表', '意见征询汇总表', '委托授权书', '项目协议书', '账户授权委托书', '其他材料'],
      componentGroup: ['Basic', 'ConsultationForm', 'SummaryForm', 'DelegateForm', 'ProtocalForm', 'SpecialForm', 'OthersForm'],
      curStep: 0,
      dialogVisible: false
    }
  },
  computed: {
    curComponent() {
      return this.componentGroup[this.curStep]
    },
    ...mapState('common', ['handleTag', 'auditOptions'])

  },
  created() {
    // 项目id,项目节点,操作前进，操作后退，操作id
    const { id, status, nextStats, lastStatus, oid } = this.$route.params
    if (!window.sessionStorage.getItem('oid')) {
      window.sessionStorage.setItem('oid', oid)
      window.sessionStorage.setItem('status', status)
      window.sessionStorage.setItem('nextStats', nextStats)
      window.sessionStorage.setItem('lastStatus', lastStatus)
    }

    // 0第一次提交材料
    if (isFinite(+id)) {
      this.projectId = id
      this.status = status
      this.getAudit()
    }
  },
  methods: {

    // 获取审核意见
    async getAudit() {
      await Community.checkLatest(this.projectId).then(res => {
        if (res.path) {
          res.files = new Array({ uid: Date.now(), url: res.path })
        }
        this.audit = res
      }).catch(() => {
        this.$message.error('数据获取失败')
      })
    },
    handleProcess(length) {
      this.curStep += length
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id } = to.params
    if (!isFinite(+id)) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  }
}
</script>

<style scoped lang="scss">
.expand-form-p ::v-deep label {
  width: 100px;
  color: #99a9bf;
}
.expand-form-p .el-form-item {
  margin-left: 20px;
  margin-bottom: 0;
  width: 100%;
}
.line-divider {
  height: 20px;
  /* background: #646464; */
  background: #14274e;
}
.step-btn-group {
  padding: 0 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
}
.step-btn-group .stepBtn {
  width: 125px;
  height: 40px;
  background: #aab4be;
  color: #fff;
  text-align: center;
  line-height: 40px;
  /* cursor: pointer; */
}
.step-btn-group .step-actived {
  background: #82a7cb;
}
.dynamic-component-container {
  margin-top: 30px;
}
.step-container {
  margin-top: 30px;
  text-align: center;
}
</style>
