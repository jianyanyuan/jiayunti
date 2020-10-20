<!--
 * @Author: your name
 * @Date: 2020-10-13 16:22:14
 * @LastEditTime: 2020-10-19 14:49:04
 * @LastEditors: zfd
 * @Description: In User Settings Edit
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
        <component :is="curComponent" />
      </keep-alive>
    </div>
    <div class="step-container">
      <el-button-group>
        <el-button v-show="curStep > 0" type="primary" icon="el-icon-arrow-left" @click="curStep--">上一步</el-button>
        <el-button v-show="curStep < stepBtnGroup.length - 1" type="primary" icon="el-icon-arrow-right" @click="curStep++">下一步</el-button>
        <el-button v-show="curStep === stepBtnGroup.length - 1" type="primary" icon="el-icon-upload2" @click="submitApplay">提交申请</el-button>

      </el-button-group>
    </div>

  </div>
</template>

<script>
import Flow from '@/components/street/Flow'
import Resident from '@/components/street/Resident'
import Design from '@/components/street/Design'
import Pipe from '@/components/street/Pipe'
import Audit from '@/components/street/Audit'

export default {
  components: {
    Audit,
    Design,
    Resident,
    Flow,
    Pipe
  },
  data() {
    return {
      stepBtnGroup: ['基本资料', '意见征询表', '意见征询汇总表', '委托授权书', '项目协议书'],
      componentGroup: ['Flow', 'Resident', 'Design', 'Pipe', 'Audit'],
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
    submitApplay() {

    }
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
  /* cursor: pointer; */
}
.step-btn-group .step-actived {
  background: #82a7cb;
}
.dynamic-component-container{
  margin-top: 30px;
}
.step-container{
  margin-top: 30px;
  text-align: center;
}
</style>
