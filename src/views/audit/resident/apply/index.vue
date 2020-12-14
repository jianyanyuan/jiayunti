<!--
 * @Author: your name
 * @Date: 2020-10-13 16:22:14
 * @LastEditTime: 2020-12-14 14:10:29
 * @LastEditors: zfd
 * @Description: resident apply
 * @FilePath: \jiayunti\src\views\street\audit\index.vue
-->
<template>
  <div class="app-container">
    <div class="line-divider" />
    <!-- @click="change($event)" -->
    <div class="step-btn-group">
      <div v-for="(item,index) in stepBtnGroup" :key="item" class="stepBtn" :step-index="index" :class="{'step-actived': curStep === index}">
        {{ item }}
      </div>
    </div>
    <div class="line-divider" />

    <div class="dynamic-component-container">
      <keep-alive>
        <component :is="curComponent" v-if="applyId" @nextProcess="handleProcess" :id="applyId" :status="status" />
      </keep-alive>
    </div>

  </div>
</template>

<script>
import Basic from './components/basic.vue'
import ConsultationForm from './components/consultation-form.vue'
import SummaryForm from './components/summary-form.vue'
import DelegateForm from './components/delegate-form.vue'
import ProtocalForm from './components/protocal-form.vue'
import SpecialForm from './components/special-form.vue'

export default {
  name: 'ResidentApply',
  components: {
    Basic,
    ConsultationForm,
    SummaryForm,
    DelegateForm,
    ProtocalForm,
    SpecialForm
  },
  data() {
    return {
      applyId: null,
      status: null,
      stepBtnGroup: ['基本资料', '意见征询表', '意见征询汇总表', '委托授权书', '项目协议书', '账户授权委托书'],
      componentGroup: ['Basic', 'ConsultationForm', 'SummaryForm', 'DelegateForm', 'ProtocalForm', 'SpecialForm'],
      curStep: 0
    }
  },
  computed: {
    curComponent() {
      return this.componentGroup[this.curStep]
    }
  },
  methods: {
    // change(event) {
    //   if (event.target.className === 'stepBtn') {
    //     this.curStep = +event.target.attributes['step-index'].value
    //   }
    // },
    handleProcess(length) {
      this.curStep += length
    }
  },
  created() {
    const { id, status } = this.$route.params
    // 1第一次提交材料
    if (!isNaN(+id) && status == 1) {
      this.applyId = id
      this.status = status
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 1第一次提交材料
    if (isNaN(+id) || status != 1) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  }
}
</script>

<style scoped>
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
