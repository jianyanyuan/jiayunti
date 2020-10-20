<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-19 15:04:56
 * @Description:
-->
<template>
  <div>
    <el-form :model="form" :rules="rule" label-width="120px">
      <el-form-item label="楼梯名称" prop="stairway">
        <el-input v-model="form.stairway" />
      </el-form-item>
      <el-form-item label="申请人姓名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="申请人地址" prop="applyAddress">
        <el-input v-model="form.applyAddress" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="加装电梯地址" prop="liftAddress">
        <el-input v-model="form.liftAddress" />
      </el-form-item>
      <el-form-item label="详细地址" prop="detailAddress">
        <el-input v-model="form.detailAddress" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Resident',
  data() {
    return {
      form: {
        stairway: '',
        name: '',
        applyAddress: '',
        phone: '',
        liftAddress: '',
        detailAddress: ''
      },
      rule: {

      }
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
