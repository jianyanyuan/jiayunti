<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-11-03 10:08:48
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\card\index.vue
-->
<template>
  <div class="app-container">
    <el-page-header style="margin-bottom:20px" content="修改设计图" @back="$router.go(-1)" />

    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span style="margin-right:20px">审核信息</span>
          <el-tag :type="audit.status | keyToVal(auditTag)">{{ audit.status | keyToVal(auditStatus) }}</el-tag>
        </div>
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
    </div>

    <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="fileList">
      <i class="el-icon-plus" />
    </el-upload>
    <!-- <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog> -->

    <div style="height:50px;text-align:center">
      <el-button type="primary" size="medium">提 交</el-button>
    </div>
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
      fileList: [
        { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
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

