<template>
  <div>
    <div>
      <p>审核意见：</p>
      <el-input v-model="audit" type="textarea" :rows="4" />
    </div>
    <div class="audit-operation">
      <el-button type="danger">否决</el-button>
      <el-button type="success">通过</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Resident',
  data() {
    return {
      audit: ''
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.audit-operation {
  width: 200px;
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
</style>
