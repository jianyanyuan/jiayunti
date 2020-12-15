<!--
 * @Author: your name
 * @Date: 2020-10-13 16:22:14
 * @LastEditTime: 2020-12-14 09:23:21
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
        <component :is="curComponent" v-if="projectId && status" @nextProcess="handleProcess" :id="projectId" :status="status" />
      </keep-alive>
    </div>

  </div>
</template>

<script>
import Archive from './components/archive.vue'
import Upload from './components/upload.vue'

export default {
  name: 'UploadDesign',
  components: {
    Archive,
    Upload
  },
  data() {
    return {
      stepBtnGroup: ['档案调取', '上传设计'],
      componentGroup: ['Archive', 'Upload'],
      curStep: 0,
      projectId: null,
      status: null
    }
  },
  computed: {
    curComponent() {
      return this.componentGroup[this.curStep]
    }
  },
  created() {
    const { id, status } = this.$route.params
    // 2方案设计
    if (!isNaN(+id) && status == 2) {
      this.projectId = id
      this.status = status
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
    },
    submitApplay() {

    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 2方案设计
    if (isNaN(+id) || status != 2) {
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
