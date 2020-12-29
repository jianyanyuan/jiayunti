<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-29 10:07:03
 * @Description: 施工端违规处理
 * @FilePath: \vue-admin-template\src\views\collapse\index.vue
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <el-form label-width="120px" class="show-form">
          <el-form-item label="申请人:">
            {{ basic.applicantName }}
          </el-form-item>
          <el-form-item label="申请时间">
            {{ basic.createTime }}
          </el-form-item>
          <el-form-item label="地址:">
            {{ basic.address }}
          </el-form-item>
          <el-form-item label="电话:">
            {{ basic.phoneNumber }}
          </el-form-item>
          <el-form-item label="加装电梯地址:">
            {{ basic.location }}
          </el-form-item>
          <el-form-item label="设计单位:">
            {{ basic.designName }}
          </el-form-item>
          <el-form-item label="设备:">
            {{ basic.device }}
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-collapse>
      <el-collapse-item v-for="(item, index) in list" :key="index">
        <template slot="title">
          监管单位：{{ item.submitter }}
          <el-tag :type="item.status | keyToVal(handleTag)" effect="dark" style="margin-left:20px">{{ item.status | keyToVal(handleFault) }}</el-tag>
        </template>
        <el-form :model="list[index]" :rules="rule" label-width="120px" class="handle-form">
          <el-form-item label="申请编号:">
            <el-input v-model="item.projectName" disabled />
          </el-form-item>
          <el-form-item label="监管单位:">
            <el-input v-model="item.submitter" disabled />
          </el-form-item>
          <el-form-item label="联系电话:">
            <el-input v-model="item.phone" disabled />
          </el-form-item>
          <el-form-item label="违规时间:">
            <el-date-picker v-model="item.time" disabled format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
          <el-form-item label="违规描述:">
            <el-input v-model="item.description" disabled />
          </el-form-item>
          <el-form-item label="违规照片:">
            <upload-list :files="item.illegalFile.map(f =>({uid:f.id,name: f.filename, url: f.path }))" list-type="picture-card" :disabled="true" />
          </el-form-item>
          <el-form-item label="违规回复:" prop="response">
            <el-input v-model="item.response" :disabled="item.status=== 0 || item.status === 2" />
          </el-form-item>
          <el-form-item label="整改照片:" prop="attachments">
            <upload-list v-if="item.status=== 0 || item.status === 2" :files="item.rectificationFile.map(f =>({uid:f.id,name: f.filename, url: f.path }))" list-type="picture-card" :disabled="true" />

            <el-upload v-else action="#" class="form-card" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,index)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" drag :auto-upload="false">
              <div>将文件拖到此处，或点击添加</div>
              <div>单个文件大小不超过20MB，可上传图片或PDF</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="处理回复:" prop="toResponse" v-if="item.status === 0 || item.status === 1">
            <el-input v-model="item.toResponse" type="textarea" autosize disabled />
          </el-form-item>
          <el-form-item label="处理结果:" prop="result" v-if="item.status === 0 || item.status === 1">
            <el-select v-model="item.result" disabled>
              <el-option v-for="result in auditOptions" :key="result.val" :value="result.key" :label="result.val" />
            </el-select>
          </el-form-item>
          <el-row type="flex" justify="center" style="margin:50px 0">
            <el-button type="primary" @click="handlePost" v-if="item.status === -1 || item.status === 1">保 存</el-button>
            <!-- <el-button @click="$router.go(-1)">返 回</el-button> -->
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
        <div class="empty-content-public" v-if="list.length === 0">暂无违规</div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import { checkUpload, notEmptyArray } from '@/utils'
import Construction from '@/api/construction'
import File from '@/api/file'
import Supervision from '@/api/supervision'

export default {
  name: 'ConstructionFault',
  data() {
    return {
      basic: {},
      rule: {
        response: [{ required: true, message: '请填写违规回复', trigger: 'blur' }],
        attachments: [{ required: true, message: '请上传整改照片', trigger: 'blur' }]
      },
      // deleteList: [], // 待删除附件
      projectId: null,
      status: null,
      list: [],
      typeName: 'rectification',
      postFailed: null, // 上传失败，二次上传
      pageLoading: false,
      handleFault: [
        { key: -1, val: '未整改' },
        { key: 0, val: '整改通过' },
        { key: 1, val: '整改未通过' },
        { key: 2, val: '待审核' }
      ],
      handleTag:[
        { key: -1, val: 'info' },
        { key: 0, val: 'success' },
        { key: 1, val: 'danger' },
        { key: 2, val: 'warning' }
      ]
    }
  },
  computed: {
    ...mapState('common', ['auditOptions'])
  },
  created() {
    const { id, status } = this.$route.params
    //11 施工中
    if (!isNaN(+id) && status == 11) {
      this.projectId = id
      this.status = status
      this.listFaults()
    }
  },
  methods: {

    listFaults() {
      this.pageLoading = true

      const basicAsync = new Promise((resolve, reject) => {
        this.$store.dispatch('getProjectBasic', this.projectId)
          .then(res => {
            this.basic = res
            resolve('获取成功')
          })
          .catch(() => {
            reject('基础信息获取失败')
          })
      })
      const detailAsync = new Promise((resolve, reject) => {
        Supervision.getFault(this.projectId).then(res => {
          if (notEmptyArray(res)) {
            res.forEach(v => {
              if (!v.response) {
                v.status = -1 // 未整改
              } else {
                // 已整改
                if (v.toResponse === undefined) {
                  v.status = 2 // 整改未回复
                } else {
                  v.status = v.result // 整改结果
                }
              }
            })
          }
          this.list = res
          resolve('获取成功')
        }).catch(() => {
          reject('信息获取失败')
        })
      })
      Promise.all([basicAsync, detailAsync])
        .catch((err) => {
          console.log(err)
          this.pageLoading = false
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
        if (this.list[index].attachments === undefined) {
          this.list[index].attachments = []
        }
        this.list[index].attachments.push(
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
      if (file.url === undefined) {
        // 未上传 --> 取消上传
        const cancelIdx = this.list[index].attachments.findIndex(f => f.uid === file.uid)
        this.list[index].attachments.splice(cancelIdx, 1)
      }
      //  else {
      //   // 已上传的 --> 待删除
      //   this.deleteList.push(file.uid)
      // }
    },
    // 保存修改
    async postFile(reforms) {
      this.pageLoading = true
      for (let idx in reforms) {
        let error = false
        const { id, response } = reforms[idx]
        await Construction.reform([{ id, response }])
          .catch((err) => {
            error = true
            // 违规保存失败，重新
            this.postFailed = reforms.slice(idx)
          })
        if (error) {
          this.$message.error('保存失败，请重新保存')
          return false // 记录上传失败
        }
        for (let a of reforms[idx].attachments) {
          await File.uploadFault(a.file, id, this.typeName)
            .catch(() => {
              error = true
              this.postFailed = reforms.slice(idx)
            })
          if (error) {
            this.$message.error('保存失败，请重新保存')
            return false // 记录上传失败
          }
        }
      }
      this.pageLoading = false
      this.$message.success('回复成功')
      this.listFaults()
    },
    handlePost() {
      if (this.postFailed) {
        // 上传失败的重新上传
        this.postFile(this.postFailed)
      } else {
        // 不校验,过滤出不通过的
        const data = this.list.filter(v => v.result !== 0).map(v => ({ id: v.id, attachments: v.attachments || [], response: v.response || '' }))
        this.postFile(data)

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
    const { id, status } = to.params
    // 11 施工中
    if (isNaN(+id) || status != 11) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
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
.dialog-image {
  text-align: center;
  img {
    width: 100%;
  }
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

