<template>
  <div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%">
      <el-table-column label="序号" min-width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="项目" min-width="180" prop="project" align="center" />
      <el-table-column label="单位" min-width="240" prop="company" align="center" />
      <el-table-column label="是否完成" min-width="180" prop="isComplete" align="center" />
      <el-table-column label="结果" min-width="240" prop="result" align="center" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Resident',
  data() {
    return {
      tableData: [
        {
          project: '线路',
          company: '电网',
          isComplete: '是',
          result: '完好'
        },
        {
          project: '建筑',
          company: '建筑公示',
          isComplete: '是',
          result: '完好'
        },
        {
          project: '水管',
          company: '水利',
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
</style>
