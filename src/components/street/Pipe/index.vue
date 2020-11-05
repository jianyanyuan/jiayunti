<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-11-03 09:24:10
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
        <el-table :data="tableData" border highlight-current-row style="width: 100%">
          <el-table-column label="序号" min-width="60" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="项目" min-width="180" prop="project" align="center" />
          <el-table-column label="单位" min-width="240" prop="company" align="center" />
          <el-table-column label="时间" min-width="240" prop="time" align="center" />
          <el-table-column label="是否完成" min-width="180" prop="isComplete" align="center" />
          <el-table-column label="结果" min-width="240" prop="result" align="center" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Resident',
  data() {
    return {
      increaseLift: {
        name: '增梯办',
        phone: '15988800323',
        address: '枫桥街道'
      },
      tableData: [
        {
          project: '线路',
          company: '电网',
          time: '2020-10-14 11:04',
          isComplete: '是',
          result: '完好'
        },
        {
          project: '建筑',
          company: '建筑公示',
          time: '2020-10-14 11:04',
          isComplete: '是',
          result: '完好'
        },
        {
          project: '水管',
          company: '水利',
          time: '2020-10-14 11:04',
          isComplete: '是',
          result: '完好'
        }
      ]
    }
  },
  methods: {

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
