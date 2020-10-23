<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-10-22 15:23:55
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\card\index.vue
-->
<template>
  <div class="app-container">
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <div>
          <p>姓名：{{ basic.name }}</p>
          <p>详细地址：{{ basic.address }}</p>
          <p>电话：{{ basic.phone }}</p>
          <p>加装电梯地址：{{ basic.liftAddress }}</p>
          <p>设计单位：{{ basic.company }}</p>
          <p>设备规格：{{ basic.spec }}</p>
        </div>
      </el-card>
    </div>

    <el-card v-for="(item, index) in dissents" :key="index" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ "异议" + (index + 1) }}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="removeDissent(index)">删除</el-button>
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
        <el-form-item label="异议反馈" prop="feedback">
          <el-input v-model="item.feedback" type="textarea" />
        </el-form-item>
      </el-form>
    </el-card>
    <div style="height:50px;text-align:center">
      <el-button type="primary" size="medium" @click="addDissent">新 增</el-button>
      <el-button v-show="dissents.length !== 0" type="primary" size="medium" @click="addDissent">提 交</el-button>
      <el-button v-show="dissents.length === 0" type="success" size="medium" @click="$router.go(-1)">无 异 议</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      basic: {
        name: '李先生',
        address: '苏州高新区',
        phone: '15988800323',
        liftAddress: '小区1楼',
        company: '苏州建研院',
        spec: '高端电梯'
      },
      ruleForm: {
        name: '',
        time: '',
        phone: '',
        address: '',
        detail: ''
      },
      dissents: [
        // {
        //   name: '',
        //   time: '',
        //   phone: '',
        //   address: '',
        //   detail: '',
        //   feedback: ''
        // }
      ],
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        time: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入异议详情', trigger: 'blur' }],
        feedback: [{ required: true, message: '请输入异议反馈', trigger: 'blur' }]
      }
    }
  },
  methods: {
    removeDissent(index) {
      if (index >= 0) {
        this.dissents.splice(index, 1)
      }
    },
    addDissent() {
      this.dissents.push(
        {
          name: '',
          time: '',
          phone: '',
          address: '',
          detail: '',
          feedback: ''
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
.basic-container /deep/ .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}
.head {
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

