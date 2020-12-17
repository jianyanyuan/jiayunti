<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-17 16:38:53
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

    <el-card v-for="(item, index) in faults" :key="index" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ "违规记录" + (index + 1) }}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="removeFault(index)">删除</el-button>
      </div>
      <el-form :ref="'ruleForm' + index" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="时间" prop="time">
          <el-date-picker v-model="item.time" type="datetime" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="违规描述:">
          <el-input v-model="item.desc" />
        </el-form-item>
        <el-form-item label="违规照片:">
          <el-upload action="#" :file-list="contentList" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,index)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,0)}" drag :auto-upload="false">

            <div>将文件拖到此处，或点击添加</div>
            <div>单个文件大小不超过20MB，可上传图片或PDF</div>
          </el-upload>
        </el-form-item>

      </el-form>
    </el-card>
    <div style="height:50px;text-align:center">
      <el-button type="primary" size="medium" @click="addFault">新 增</el-button>
      <el-button v-show="faults.length !== 0" type="success" size="medium" @click="addFault">提 交</el-button>
      <el-button v-show="faults.length === 0" type="success" size="medium" @click="$router.go(-1)">返回</el-button>
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
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        time: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        detail: [{ required: true, message: '请输入异议详情', trigger: 'blur' }],
        feedback: [{ required: true, message: '请输入异议反馈', trigger: 'blur' }]
      },
      faults: [],
      typeName: 'fault-material',
      projectId: null,
      status: null,
      postFailed: null

    }
  },
  computed: {

  },
  created() {

  },
  methods: {
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList, index) {
      const valid = this.checkUpload(file.raw)
      if (valid && file.status === 'ready') {
        const formData = new FormData()
        formData.append('file', file.raw)
        this.faults[index].attachments.push(
          {
            uid: file.uid,
            file: formData
          }
        )
      } else {
        fileList.pop()
      }
    },
    // 图片上传之前判断
    checkUpload(file) {
      if (!file.size) {
        this.$message.error('上传为空！')
        return false
      }
      const typeAllowed = /\bpdf|\bimage/i.test(file.type)
      const isBig = file.size <= 1024 * 1024 * 10 // 单个文件最大10M
      if (!typeAllowed) {
        this.$message.error('只能上传图片或pdf！')
        return false
      }
      if (!isBig) {
        this.$message.error('图片大小不能超过10MB！')
        return false
      }
      return true
    },
    // 删除文件
    handleUploadRemove(file, fileList, index) {
      const cancelIdx = this.faults[index].attachments.findIndex(f => f.uid === file.uid)
      this.faults[index].attachmentssplice(cancelIdx, 1)
    },
    addFault() {
      this.faults.push(
        {
          time: '',
          attachments: []
        })
    },
    // 保存修改
    postFile() {
      this.pageLoading = true
      const failedArr = []
      this.faults.forEach(async (fault, fIdx) => {
        let fileIds = []
        let error = false
        fault.attachments.forEach(async (a, aIdx, arr) => {
          await File.upload(a.file, { typeName: this.typeName, projectId: this.projectId })
            .then((res) => {
              // fileIds.push = res.fileId
              // arr.splice(aIdx,1)
            })
            .catch(() => {
              error = true
            })

        })
        if (error) {
          failedArr.push(fault)
          return // 附件保存失败，返回
        }
        fault.files = fileIds
        await Community.listObjection(fault)
          .catch((err) => {
            // 违规保存失败，重新上传该违规记录
            failedArr.push(fault)
          })
      })
      this.pageLoading = false

      if (failedArr.length > 0) {
        this.$message.error('保存失败')
      } else {
        this.$router.go(-1)
      }
      
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

