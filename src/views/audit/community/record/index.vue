<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-14 08:20:36
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\card\index.vue
-->
<template>
  <div class="app-container">
    <div class="basic-container" v-loading="pageLoading">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <el-form label-width="120px" class="show-form">
          <el-form-item label="姓名">
            {{ basic.applicantName }}
          </el-form-item>
          <el-form-item label="申请时间">
            {{ row.apply.createTime }}
          </el-form-item>
          <el-form-item label="用户地址">
            {{ basic.address }}
          </el-form-item>
          <el-form-item label="电话">
            {{ basic.phoneNumber }}
          </el-form-item>
          <el-form-item label="加装电梯地址">
            {{ basic.location }}
          </el-form-item>
          <el-form-item label="设计单位">
            {{ basic.designName }}
          </el-form-item>
          <el-form-item label="设备">
            {{ basic.device }}
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card v-for="(item, index) in dissents" :key="index" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ "异议" + (index + 1) }}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="removeDissent(index)">删除</el-button>
      </div>
      <el-form :ref="ruleForm + index" :model="item" :rules="rules" label-width="100px" :disabled="formDisabled">
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
        <el-form-item label="处理结果" prop="feedback">
          <el-select v-model="item.result">
            <el-option v-for="res in resultOptions" :key="res.val" :value="res.key" :label="res.val" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="height:50px;text-align:center">
      <el-button type="primary" size="medium" @click="addDissent">新 增</el-button>
      <el-button v-show="dissents.length !== 0" type="success" size="medium" @click="handleSubmit">提 交</el-button>
      <el-button v-show="dissents.length === 0" type="success" size="medium" @click="$router.go(-1)">无 异 议</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Project from '@/api/projects'

export default {
  data() {
    return {
      pageLoading: false,
      formDisabled: false,
      basic: null,
      ruleForm: {
        name: '',
        time: '',
        phone: '',
        address: '',
        detail: ''
      },
      dissents: [],
      resultOptions: [
        { key: 0, val: '通过' },
        { key: -1, val: '不通过' }
      ],
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        time: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入异议详情', trigger: 'blur' }],
        feedback: [{ required: true, message: '请输入异议反馈', trigger: 'blur' }],
        result: [{ required: true, message: '请输入异议反馈', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getBasic()
  },
  methods: {
    getBasic() {
      this.pageLoading = true
      this.$store.dispatch('getProjectBasic')
        .then(res => {
          this.basic = res
          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
          this.$message.error('信息获取失败')
        })

    },
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
          feedback: '',
          result: ''
        })
    },
    handleSubmit() {
      let valid = true
      for (let i = 0; i < this.dissents.length; i++) {
        if (!valid) break
        this.$refs[ruleForm + i].validate(success => {
          valid = success
        })
      }
      if (valid) {
        // this.dissents.forEach(v => {

        // })
      } else {
        this.$message.error('请补全信息')
      }
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

