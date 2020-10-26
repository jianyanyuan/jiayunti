<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-10-26 08:52:09
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\card\index.vue
-->
<template>
  <div class="app-container">
    <el-page-header style="margin-bottom:20px" content="审核详情" @back="$router.go(-1)" />
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>审核信息</span>
        </div>
        <div>
          审核状态：<el-tag :type="audit.status | keyToVal(auditTag)">{{ audit.status | keyToVal(auditStatus) }}</el-tag>
          <el-form v-if="audit.status !== 0" label-position="left" inline class="demo-table-expand">
            <el-form-item label="审核人">
              <span>{{ audit.name }}</span>
            </el-form-item>
            <el-form-item label="审核机构">
              <span>{{ audit.insitution }}</span>
            </el-form-item>
            <el-form-item label="机构地址：">
              <span>{{ audit.address }}</span>
            </el-form-item>
            <el-form-item label="电话：">
              <span>{{ audit.phone }}</span>
            </el-form-item>
            <el-form-item label="审核时间：">
              <span>{{ audit.time }}</span>
            </el-form-item>
            <el-form-item label="审核意见：">
              <span>{{ audit.comments }}</span>
            </el-form-item>
          </el-form>
        </div>
        <!-- <div slot=" header">
            <span>基本信息</span>
        </div>
        <div>
          <p>姓名：{{ basic.name }}</p>
          <p>详细地址：{{ basic.address }}</p>
          <p>电话：{{ basic.phone }}</p>
          <p>加装电梯地址：{{ basic.liftAddress }}</p>
          <p>设计单位：{{ basic.company }}</p>
          <p>设备规格：{{ basic.spec }}</p>
        </div> -->
      </el-card>
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>申请信息</span>
        </div>
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="申请人">
            <span>{{ apply.name }}</span>
          </el-form-item>
          <el-form-item label="详细地址">
            <span>{{ apply.address }}</span>
          </el-form-item>
          <el-form-item label="电话">
            <span>{{ apply.phone }}</span>
          </el-form-item>
          <el-form-item label="加装电梯地址">
            <span>{{ apply.liftAddress }}</span>
          </el-form-item>
          <el-form-item label="设备规格">
            <span>{{ apply.spec }}</span>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <ul>
      <li v-for="url in urls" :key="url" style="text-align:center">
        <el-image :src="url" />
      </li>
    </ul>

    <!-- <div style="height:50px;text-align:center">
      <el-button type="primary" size="medium" @click="">返 回</el-button>
    </div> -->
  </div>
</template>

<script>
import { keyToVal } from '@/utils'

export default {
  filters: {
    keyToVal
  },
  data() {
    return {
      audit: {
        status: 1,
        insitution: '图审机构',
        address: '苏州高新区',
        phone: '15988800323',
        name: '李先生',
        time: '2020-10-13 08:00',
        comments: '审核通过'
      },
      apply: {
        name: '李先生',
        address: '苏州高新区',
        phone: '15988800323',
        liftAddress: '小区1楼',
        spec: '高端电梯',
        time: '2020-10-14 08:00'
      },
      auditStatus: [
        { key: 0, val: '审核中' },
        { key: 1, val: '审核未通过' },
        { key: 2, val: '审核通过' }
      ],
      auditTag: [
        { key: 0, val: 'warning' },
        { key: 1, val: 'danger' },
        { key: 2, val: 'success' }
      ],
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      ]
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
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand /deep/ label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 20px;
  margin-bottom: 0;
  width: 100%;
}

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
.demo-image__lazy {
  height: 400px;
  overflow-y: auto;
}
</style>

