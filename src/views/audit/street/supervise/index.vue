<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-10-26 13:27:55
 * @Description: 街道监管违规记录
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

    <el-card class="box-card" title="违规记录">
      <el-form :ref="ruleForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="时间" prop="time">
          <el-date-picker v-model="form.time" type="datetime" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="违规描述" prop="detail">
          <el-input v-model="form.detail" type="textarea" />
        </el-form-item>
        <el-form-item label="违规详情" prop="feedback">
          <el-upload action="#" :on-remove="handleUploadRemove" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" list-type="picture" drag multiple :auto-upload="false">
            <div>将文件拖到此处，或点击添加</div>
            <p>单个文件大小不超过20MB，可上传图片或PDF</p>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="height:50px;text-align:center">
      <el-button v-show="dissents.length !== 0" type="primary" size="medium" @click="addDissent">提 交</el-button>
      <el-button v-show="dissents.length === 0" type="success" size="medium" @click="$router.go(-1)">返 回</el-button>
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
    },
    handleUploadRemove(file, fileList) {
    },
    // 上传文件发生改变时
    handleUploadChange(file, fileList, index) {
      if (fileList.length > 0) {
        this.model[index] = fileList.map(f => f.raw)
      }
    },
    // 图片上传之前判断
    uploadBefore(file) {
      const isImage = file.type.indexOf('image') !== -1
      const isBig = file.size <= 1024 * 1024 * 10
      if (!file) {
        this.$message.error('上传为空！')
        return false
      }
      if (!isImage) {
        this.$message.error('只能上传图片！')
        return false
      }
      if (!isBig) {
        this.$message.error('图片大小不能超过10MB！')
        return false
      }
      return true
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

