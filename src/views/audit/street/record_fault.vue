<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-11-02 14:17:37
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\card\index.vue
-->
<template>
  <div class="app-container">
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>施工单位信息</span>
        </div>
        <el-form label-width="120px" class="show-form">
          <el-form-item label="施工单位：">
            {{ basic.name }}
          </el-form-item>
          <el-form-item label="地址：">
            {{ basic.address }}
          </el-form-item>
          <el-form-item label="电话：">
            {{ basic.phone }}
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card v-for="(item, index) in dissents" :key="index" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ "违规记录" + (index + 1) }}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="removeDissent(index)">删除</el-button>
      </div>
      <el-form :ref="ruleForm + index" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="时间" prop="time">
          <el-date-picker v-model="item.time" type="datetime" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="违规描述:">
          <el-input v-model="item.desc" />
        </el-form-item>
        <el-form-item label="违规照片:">
          <el-upload action="#" class="form-card" :on-remove="handleUploadRemove" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" list-type="picture" drag multiple :auto-upload="false">

            <div>将文件拖到此处，或点击添加</div>
            <div>单个文件大小不超过20MB，可上传图片或PDF</div>
          </el-upload>
        </el-form-item>

      </el-form>
    </el-card>
    <div style="height:50px;text-align:center">
      <el-button type="primary" size="medium" @click="addDissent">新 增</el-button>
      <el-button v-show="dissents.length !== 0" type="success" size="medium" @click="addDissent">提 交</el-button>
      <el-button v-show="dissents.length === 0" type="success" size="medium" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      basic: {
        name: '李先生',
        address: 'dsadasdsad',
        phone: '15988800323'
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
  computed: {
    ...mapGetters('common', ['addressOptions', 'plotOptions'])

  },
  created() {
    this.plot = this.basic.address.slice(3)

    this.basic.address = this.basic.address.slice(0, 3)
  },
  methods: {
    handleUploadRemove(file, fileList) {
    },
    // handleUploadChange(file, fileList) {
    //   console.log(file)
    //   console.log(fileList)
    //   debugger
    // },
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
    },
    removeDissent(index) {
      if (index >= 0) {
        this.dissents.splice(index, 1)
      }
    },
    addDissent() {
      this.dissents.push(
        {
          time: '',
          desc: ''
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

<style scoped lang="scss">
.basic-container ::v-deep .el-card__header:nth-child(1) {
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
.form-card ::v-deep .el-upload-dragger {
  width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
</style>

