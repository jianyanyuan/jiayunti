<!--
 * @Author: your name
 * @Date: 2020-10-13 16:22:14
 * @LastEditTime: 2020-11-03 08:50:23
 * @LastEditors: zfd
 * @Description: In User Settings Edit
 * @FilePath: \jiayunti\src\views\street\audit\index.vue
-->
<template>
  <div class="app-container">
    <div class="line-divider" />
    <div class="step-btn-group" @click="change($event)">
      <el-button v-show="curStep > 0" type="primary" icon="el-icon-arrow-left" @click="curStep--" />
      <div v-for="(item,index) in stepBtnGroup" :key="item" class="stepBtn" :step-index="index" :class="{'step-actived': curStep === index}">
        {{ item }}
      </div>
      <el-button v-show="curStep < stepBtnGroup.length - 1" type="primary" icon="el-icon-right" @click="curStep++" />
    </div>
    <div class="line-divider" />

    <div class="dynamic-component-container">
      <component :is="curComponent" :params="params" />
    </div>

  </div>
</template>

<script>
import Flow from '@/components/street/Flow'
import Resident from '@/components/street/Resident'
// import Design from '@/components/street/Design'
// import Pipe from '@/components/street/Pipe'
import Audit from '@/components/street/Audit'

export default {
  name: 'Check',
  components: {
    Audit,
    // Design,
    Resident,
    Flow
    // Pipe
  },
  data() {
    return {
      params: {
        applyId: '',
        status: ''
      },
      stepBtnGroup: ['申请流程图', '居民申请材料', '审核'],
      componentGroup: ['Flow', 'Resident', 'Audit'],
      curStep: 0
    }
  },
  computed: {
    curComponent() {
      return this.componentGroup[this.curStep]
    }
  },
  methods: {
    change(event) {
      if (event.target.className === 'stepBtn') {
        this.curStep = +event.target.attributes['step-index'].value
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!to.params.status) {
        vm.$router.push(from.fullPath)
        return false
      }
      vm.params.status = to.params.status
    })
  }
}
</script>

<style scoped>
.line-divider {
  height: 20px;
  background: #19305c;
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
  cursor: pointer;
}
.step-btn-group .step-actived {
  background: #82a7cb;
}
.dynamic-component-container{
  margin-top: 30px;
}
</style>
