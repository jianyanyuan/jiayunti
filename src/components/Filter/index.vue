<!--
 * @Author: zfd
 * @Date: 2020-12-29 13:53:41
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-30 09:44:53
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
      <el-form-item v-if="status" label="操作" prop="status " style="margin-right: 30px">
        <el-select v-model="query.status">
          <el-option v-for="item in status" :key="item.val" :label="item.val" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="listApplies">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-circle-close" @click="clearQuery">重置</el-button>
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
  props: {
    status: {
      type: Array,
      defualt: []
    }
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
      this.$emit('listFn', { pageIndex: 0, size: this.pagination.pageSize }, this.query)
    }
  }
}
</script>
