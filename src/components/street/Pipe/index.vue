<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-12-16 09:50:04
 * @LastEditors: zfd
 * @Description: In User Settings Edit
 * @FilePath: \jiayunti\src\components\street\Pipe\index.vue
-->
<template>
  <div>
    <el-tabs tab-position="left">
      <el-tab-pane label="基本信息">
        <el-card class="expand-info">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="增梯办">
              <span>{{ increaseLift.name }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ increaseLift.phone }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ increaseLift.address }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="管道记录">
        <!-- 查看 -->
        <el-table :data="tableData" border highlight-current-row style="width: 100%">
          <el-table-column label="序号" min-width="60" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="项目" min-width="180" align="center">
            <template slot-scope="{row}">
              {{ row.type }}
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="240" align="center">
            <template slot-scope="{row}">
              {{ row.unit }}
              <!-- <el-input v-model="row.company" size="small" /> -->
            </template>
          </el-table-column>
          <el-table-column label="是否完成" min-width="180" align="center">
            <template slot-scope="{row}">
              {{ row.whetherComplete ? '是' : '否'}}
              <!-- <el-checkbox v-model="row.isComplete">是</el-checkbox> -->
            </template>
          </el-table-column>
          <el-table-column label="时间" min-width="250" align="center">
            <template slot-scope="{row}">
              <span v-if="row.completeTime && row.whetherComplete">{{ new Date(row.completeTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结果" min-width="240" align="center">
            <template slot-scope="{row}">
              {{ row.note }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import IncreaseLift from '@/api/increase_lift'
import { notEmptyArray } from '@/utils'

export default {
  name: 'AuditPipe',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    status: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      increaseLift: {
        name: '增梯办',
        phone: '15988800323',
        address: '枫桥街道'
      },
      pageLoading:false,
      tableData: []
    }
  },
  created() {
    this.detailApply()
  },
  methods: {
    detailApply() {
      this.pageLoading = true
      const basicAsync = new Promise((resolve, reject) => {
        this.$store.dispatch('getProjectBasic', this.projectId)
          .then(res => {
            this.increaseLift = res
            resolve('获取成功')
          })
          .catch(() => {
            reject('基础信息获取失败')
          })
      })
      const detailAsync = new Promise((resolve, reject) => {
        IncreaseLift.listPipe(this.projectId)
          .then(res => {
            if (notEmptyArray(res.content)) {
              this.tableData = res.content
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
  }
}
</script>

<style scoped>
.expand-info .demo-table-expand ::v-deep label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 150px;
  margin-bottom: 0;
  width: 100%;
}
</style>
