<!--
 * @Author: zfd
 * @Date: 2020-12-29 13:53:41
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-29 14:46:49
 * @Description: 
-->
<template>
  <div class="list-query-public">
    <el-form ref="queryForm" :inline="true" :model="query" size="small">
      <el-form-item label="编号" prop="projectName " style="margin-right: 30px">
        <el-input v-model="query.projectName" />
      </el-form-item>
      <el-form-item label="申请人" prop="applicantName " style="margin-right: 30px">
        <el-input v-model="query.applicantName" />
      </el-form-item>
      <el-form-item label="状态" prop="status " style="margin-right: 30px" v-if="status">
        <el-select v-model="query.status">
          <el-option v-for="item in status" :key="item.val" :label="item.val" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="listApplies">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-circle-close" @click="clearQuery">清除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
const defaultQuery = {
  applicantName: null,
  projectName: null,
  status: null
}
export default {
  name: 'FilterList',
  props:{
    status:{
      type:Array,
      defualt:[]
    },
  },
  data() {
    return {
      query: Object.assign({}, defaultQuery)
    }
  },
  methods: {
    clearQuery() {
      this.query = Object.assign({}, defaultQuery)
      this.listApplies()
    },
    listApplies() {
      this.$emit('listFn',this.query)
    }
  }
}
</script>