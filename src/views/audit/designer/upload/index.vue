<!--
 * @Author: your name
 * @Date: 2020-10-13 16:22:14
 * @LastEditTime: 2021-03-16 17:18:04
 * @LastEditors: Please set LastEditors
 * @Description: resident apply
 * @FilePath: \jiayunti\src\views\street\audit\index.vue
-->
<template>
  <div class="app-container">
    <div class="line-divider-public" />
    <!-- @click="change($event)" -->
    <div class="step-btn-group-public">
      <div
        v-for="(item, index) in stepBtnGroup"
        :key="item"
        class="stepBtn"
        :step-index="index"
        :class="{ 'step-actived': curStep === index }"
      >
        {{ item }}
      </div>
    </div>
    <div class="line-divider-public" />

    <div v-if="projectId" class="gap-top-public">
      <keep-alive>
        <component
          :is="curComponent"
          :id="projectId"
          @nextProcess="handleProcess"
        />
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
      projectId: null
    }
  },
  computed: {
    curComponent() {
      return this.componentGroup[this.curStep]
    }
  },
  created() {
    const { id, oid } = this.$route.params
    if (isFinite(+id)) {
      this.projectId = id
      if (!window.sessionStorage.getItem('projectId')) {
        window.sessionStorage.setItem('projectId', id)
        window.sessionStorage.setItem('oid', oid)
      }
    }
  },
  beforeDestroy() {
    window.sessionStorage.removeItem('projectId')
    window.sessionStorage.removeItem('oid')
  },
  methods: {
    handleProcess(length) {
      this.curStep += length
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id } = to.params
    if (isFinite(+id)) {
      next()
    } else {
      next('/redirect' + from.fullPath)
    }
  }
}
</script>

<style scoped>

</style>
