<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-14 15:51:26
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
            {{ basic.createTime }}
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

    <el-card v-for="(item, index) in objection" :key="index" class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ "异议" + (index + 1) }}</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="removeObjection(index,item)">删除</el-button>
      </div>
      <el-form :ref="'ruleForm' + index" :model="item" :rules="rules" label-width="100px" :disabled="formDisabled">
        <el-form-item label="建议人" prop="adviceName">
          <el-input v-model="item.adviceName" />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker v-model="item.time" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phoneNumber">
          <el-input v-model="item.phoneNumber" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="item.address" />
        </el-form-item>
        <el-form-item label="异议详情" prop="objection">
          <el-input v-model="item.objection" type="textarea" />
        </el-form-item>
        <el-form-item label="异议反馈" prop="toObjection">
          <el-input v-model="item.toObjection" type="textarea" />
        </el-form-item>
        <el-form-item label="处理结果" prop="result">
          <el-select v-model="item.result">
            <el-option v-for="res in checkOptions" :key="res.val" :value="res.key" :label="res.val" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <div style="height:50px;text-align:center">
      <el-button type="primary" size="medium" @click="addObjection">新 增</el-button>
      <el-button type="success" size="medium" @click="handleSubmit">{{objection.length === 0 ? '无 异 议':'提 交'}}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Community from '@/api/community'
import { notEmptyArray } from '@/utils'

export default {
  name: 'CommunityRecord',
  data() {
    return {
      pageLoading: false,
      formDisabled: false,
      basic: {},
      applyId: null,
      ruleForm: {
        name: '',
        time: '',
        phone: '',
        address: '',
        detail: ''
      },
      objection: [],
      updateList: [],
      deleteList: [],
      postList: [],
      rules: {
        adviceName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        time: [{ required: true, message: '请选择时间', trigger: 'blur' }],
        phoneNumber: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        objection: [{ required: true, message: '请输入异议详情', trigger: 'blur' }],
        toObjection: [{ required: true, message: '请输入异议反馈', trigger: 'blur' }],
        result: [{ required: true, message: '请选择处理结果', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState('common', ['checkOptions'])
  },
  created() {
    const { id, status } = this.$route.params
    // 3异议记录
    if (!isNaN(+id) && status == 3) {
      this.applyId = id
      this.status = status
      this.detailApply()
    }
  },
  methods: {
    detailApply() {
      this.pageLoading = true
      const basicAsync = new Promise((resolve, reject) => {
        this.$store.dispatch('getProjectBasic', this.applyId)
          .then(res => {
            this.basic = res
            resolve('获取成功')
          })
          .catch(() => {
            reject('基础信息获取失败')
          })
      })
      const detailAsync = new Promise((resolve, reject) => {
        Community.listObjection(this.applyId)
          .then(res => {
            if (notEmptyArray(res)) {
              this.objection = res
            }
            resolve('ok')
          })
          .catch((err) => {
            reject(err)
          })
      })
      Promise.all([basicAsync, detailAsync]).then(() => {
        this.pageLoading = false
      }).catch((err) => {
        console.log(err)
        this.pageLoading = false
        this.$message.error('信息获取失败')
      })

    },
    removeObjection(index, item) {
      if (index >= 0) {
        this.objection.splice(index, 1)
      }
      if (item.id !== undefined) {
        // 已上传
        this.deleteList.push(item.id)
      }
      if(item.timeStamp) {
        // 未上传
        const idx = this.postList.findIndex(v=> v.timeStamp === item.timeStamp)
        this.postList.splice(idx,1)
      }

    },
    addObjection() {
      const obj = {
        adviceName: '',
        time: '',
        phoneNumber: '',
        address: '',
        objection: '',
        toObjection: '',
        result: '',
        timeStamp:Date.now()
      }
      this.objection.push(obj)
      this.postList.push(obj)
    },
    async handleSubmit() {
      let valid = true
      for (let i = 0; i < this.objection.length; i++) {
        const refName = `ruleForm${i}`
        if(!valid) {
          break
        }
        this.$refs[refName][0].validate(success=>{
          valid = success
        })
      }
      if (valid) {
        this.pageLoading = true
        this.updateList = this.objection.filter(v => v.id !== undefined)
        console.log(this.updateList)
        const asyncList = []
        if (notEmptyArray(this.postList)) {
          const postAsync = Community.addObjection(this.applyId, this.postList)
          asyncList.push(postAsync)
        }
        if (notEmptyArray(this.updateList)) {
          const updateAsync = Community.modifyObjection(this.updateList)
          asyncList.push(updateAsync)
        }
        if (notEmptyArray(this.deleteList)) {
          this.deleteList.forEach(v => {
            const deleteAsync = Community.removeObjection(v)
            asyncList.push(deleteAsync)
          })
        }
        Promise.all(asyncList).then(() => {
          this.pageLoading = false
          this.$router.push('/community/list')
        }).catch(() => {
          this.pageLoading = false
          this.$message.error('保存失败')
        })
      } else {
        this.$message.error('请补全信息')
      }
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 公示阶段，异议记录
    if (isNaN(+id) || status != 3) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
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

