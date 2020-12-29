<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-29 16:52:39
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\card\index.vue
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>施工单位信息</span>
        </div>
        <el-form label-width="120px" class="show-form">
          <el-form-item label="施工单位：">
            {{ construction.constructionName }}
          </el-form-item>
          <el-form-item label="地址：">
            {{ construction.address }}
          </el-form-item>
          <el-form-item label="电话：">
            {{ construction.phone }}
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <el-card v-for="(item, index) in faults" :key="index" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ "违规记录" + (index + 1) }}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="removeFault(index)">删除</el-button>
      </div>
      <el-form :ref="'ruleForm' + index" :model="item" :rules="rules" label-width="100px" class="form-card">
        <el-form-item label="时间" prop="time">
          <el-date-picker v-model="item.time" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="违规描述:" prop="description">
          <el-input v-model="item.description" />
        </el-form-item>
        <el-form-item label="违规照片:" prop="attachments">
          <el-upload action="#" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,index)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" drag :auto-upload="false">
            <div>将文件拖到此处，或点击添加</div>
            <div>单个文件大小不超过20MB，可上传图片或PDF</div>
          </el-upload>
        </el-form-item>

      </el-form>
    </el-card>
    <div style="height:50px;text-align:center">
      <el-button type="primary" size="medium" @click="addFault">新 增</el-button>
      <el-button v-show="faults.length !== 0" type="success" size="medium" @click="handlePost">提 交</el-button>
      <el-button v-show="faults.length === 0" type="success" size="medium" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { checkUpload } from '@/utils'
import File from '@/api/file'
import Supervision from '@/api/supervision'
import Construction from '@/api/construction'

export default {
  name: 'FaultRecord',
  data() {
    return {
      pageLoading: false,
      construction: {},
      rules: {
        time: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        description: [{ required: true, message: '请给出描述', trigger: 'blur' }],
        attachments: [{ required: true, message: '请选择附件', trigger: 'blur' }]
      },
      faults: [],
      typeName: 'illegal',
      projectId: null,
      status: null,
      postFailed: null,
      fromPath: null
    }
  },
  computed: {

  },
  created() {
    const { id, status } = this.$route.query
    //11 施工中
    if (!isNaN(+id) && status == 11) {
      this.projectId = id
      this.status = status
      this.getInfo()
    }
  },
  methods: {
    getInfo() {
      this.pageLoading = true
      Construction.getInfo(this.projectId).then(res => {
        this.construction = res
      })
        .catch((err) => {
          this.$message.error('信息获取失败')
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList, index) {
      const valid = checkUpload(file.raw)
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

    // 删除文件
    handleUploadRemove(file, fileList, index) {
      const cancelIdx = this.faults[index].attachments.findIndex(f => f.uid === file.uid)
      this.faults[index].attachments.splice(cancelIdx, 1)
    },
    removeFault(index) {
      this.faults.splice(index, 1)
    },
    addFault() {
      this.faults.push(
        {
          time: '',
          attachments: [],
          projectId: this.projectId,
          description: ''
        })
    },
    // 保存修改
    async postFile(faults) {
      this.pageLoading = true
      for (let idx in faults) {
        let faultId
        let error = false
        const { projectId, description, time } = faults[idx]
        await Supervision.addFault([{ projectId, description, time }])
          .then((res) => {
            faultId = res[0].id
          })
          .catch((err) => {
            error = true
            // 违规保存失败，重新上传该违规记录
            this.postFailed = faults.slice(idx)
          })
        if (error) {
          this.$message.error('保存失败，请重新保存')
          return false // 记录上传失败
        }
        for (let a of faults[idx].attachments) {
          await File.uploadFault(a.file, faultId, this.typeName)
            .catch(() => {
              error = true
              this.postFailed = faults.slice(idx)
            })
          if (error) {
            this.$message.error('保存失败，请重新保存')
            return false // 记录上传失败
          }
        }
      }
      this.pageLoading = false
      this.$router.push(this.fromPath)
    },
    handlePost() {
      if (this.postFailed) {
        // 上传失败的重新上传
        this.postFile(this.postFailed)
      } else {
        // 不校验
        this.postFile(this.faults)
        // 校验用户数据填写合法性
        // let valid = true
        // for (let i = 0; i < this.faults.length; i++) {
        //   const refName = `ruleForm${i}`
        //   if (!valid) {
        //     break
        //   }
        //   if (this.faults[i].attachments.length === 0) {
        //     valid = false
        //     break
        //   }
        //   this.$refs[refName][0].validate(success => {
        //     valid = success
        //   })
        // }
        // if (valid) {
        //   this.postFile(this.faults)
        // } else {
        //   this.$message.error('请补全信息')
        // }
      }
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.query
    // 11 施工中
    if (isNaN(+id) || status != 11) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next(vm => {
        vm.fromPath = from.fullPath
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

