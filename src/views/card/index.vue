<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-10-11 20:55:15
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\card\index.vue
-->
<template>
  <div class="app-container">
    <div class="clearfix" style="height:50px">
      <el-button style="float: right;" type="primary" size="medium" @click="addDissent">新增</el-button>
    </div>
    <el-card v-for="(item, index) in dissents" :key="index" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ "异议" + (index + 1) }}</span>
        <el-button v-if="index != 0" style="float: right; padding: 3px 0" type="text" @click="removeDissent(index)">删除</el-button>
      </div>
      <el-form :ref="ruleForm + index" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="建议人" prop="name">
          <el-input v-model="item.name" />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker v-model="item.time" type="datetime" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="item.phone" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="item.address" />
        </el-form-item>
        <el-form-item label="异议详情" prop="detail">
          <el-input v-model="item.detail" type="textarea" />
        </el-form-item>
      </el-form>
    </el-card>
    <div style="height:50px">
      <el-button type="primary" size="medium" @click="addDissent">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        name: '',
        time: '',
        phone: '',
        address: '',
        detail: ''
      },
      dissents: [
        {
          name: '',
          time: '',
          phone: '',
          address: '',
          detail: ''
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        time: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入异议详情', trigger: 'blur' }]
      }
    }
  },
  methods: {
    removeDissent(index) {
      if (index > 0) {
        this.dissents = this.dissents.splice(index, 1)
      }
    },
    addDissent() {
      this.dissents.push(
        {
          name: '',
          time: '',
          phone: '',
          address: '',
          detail: ''
        })
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.head{
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
</style>

