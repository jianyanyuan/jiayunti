<!--
 * @Author: zfd
 * @Date: 2020-12-09 08:27:43
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-10 16:44:37
 * @Description: 已审核列表
-->

<template>
  <div class="app-container">
    <div class="manage-query">
      <el-form ref="queryForm" :inline="true" :model="query" size="small">
        <el-form-item label="编号" prop="Name " style="margin-right: 30px">
          <el-input v-model="query.code" />
        </el-form-item>
        <el-form-item label="申请人" prop="applyName " style="margin-right: 30px">
          <el-input v-model="query.applyName" />
        </el-form-item>
        <el-form-item label="状态" prop="audit " style="margin-right: 30px">
          <el-select v-model="query.audit">
            <el-option v-for="item in auditOptions" :key="item.val" :label="item.val" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="goSearch">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-circle-close" @click="clearQuery">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-card>
      <el-table v-loading="listLoading" row-key="$index" style="width:100%" :data="list" :default-sort="{prop: 'addTime', order: 'descending'}" fit highlight-current-row @row-dblclick="showAudit">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="projectName" />
        <el-table-column label="提交时间" align="center" prop="addTime" sortable min-width="145px">
          <template slot-scope="{row}">
            <i class="el-icon-time" />
            <span>{{ new Date(row.addTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" align="center" prop="auditTime" sortable min-width="145px">
          <template v-if="scope.row.auditTime" slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ new Date(scope.row.auditTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="whetherThrough" sortable>
          <template slot-scope="scope">
            <el-tag :type="scope.row.whetherThrough | keyToVal(auditOptions)">{{ scope.row.whetherThrough | keyToVal(auditOptions) }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="">审核意见</el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>
    <el-pagination background layout="prev, pager, next, total,sizes,jumper" hide-on-single-page :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Community from '@/api/community'
import { notEmptyArray } from '@/utils'
export default {
  name: 'CommunityAudited',
  data() {
    return {
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      query: {
        code: '',
        applyName: '',
        audit: ''
      },
      list: [],
      listLoading: false
    }
  },
  computed: {
    ...mapState('common', ['auditOptions'])

  },
  created() { this.listApplies()},
  methods: {
    // 获取已审核列表
    async listApplies() {
      this.listLoading = true
      await Community.auditHistorylist({ page: this.pagination.pageIndex - 1, size: this.pagination.pageSize }).then(res => {
        if (notEmptyArray(res.content)) {
          this.list = res.content
          this.pagination.total = res.totalElements
        }
      }).catch(err => {
        this.$message.error('数据获取失败')
        console.log(err)
      })
      this.listLoading = false
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.listApplies()
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
      this.listApplies()
    },
    showAudit(row){
      this.$router.push({name:'CommunityAuditedDetail',params:{id:row.id,status:row.statusId}})
    },
    goSearch() { },
    clearQuery() { },
  }
}

</script>
<style scoped>
.manage-query {
  height: 45px;
  padding: 5px 20px;
  background: #efefef;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}
</style>
