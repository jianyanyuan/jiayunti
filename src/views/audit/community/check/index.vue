<!--
 * @Author: your name
 * @Date: 2020-10-13 16:22:14
 * @LastEditTime: 2020-12-14 09:21:42
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
      <keep-alive>
        <component v-if="applyId && status" :is="curComponent" :id="applyId" :status="status" />
      </keep-alive>
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
  name: 'CommunityCheck',
  components: {
    Audit,
    // Design,
    Resident,
    // Flow
    // Pipe
  },
  data() {
    return {
      applyId: null,
      status: null,
      stepBtnGroup: [/*'申请流程图',*/  '居民申请材料', '审核'],
      componentGroup: [/**'Flow', */ 'Resident', 'Audit'],
      curStep: 0
    }
  },
  computed: {
    curComponent() {
      return this.componentGroup[this.curStep]
    }
  },
  created() {
    const { id, statusId } = to.params
    // 1社区受理 3社区第二次受理
    const valid = status == 1 || status == 3
    if (!isNaN(+id) && valid) {
      this.applyId = id
      this.status = status
    }
  },
  methods: {
    change(event) {
      if (event.target.className === 'stepBtn') {
        this.curStep = +event.target.attributes['step-index'].value
      }
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, statusId } = to.params
    // 1社区受理 3社区第二次受理
    const valid = status == 1 || status == 3
    if (isNaN(+id) || !valid) {
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
.dynamic-component-container {
  margin-top: 30px;
}
</style>
