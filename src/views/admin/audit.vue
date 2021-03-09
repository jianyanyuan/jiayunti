<!--
 * @Author: zfd
 * @Date: 2020-12-09 08:27:43
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-29 16:02:09
 * @Description: 已审核列表
-->

<template>
  <div class="app-container">
    <el-input placeholder="单位名称" class="filter__input" />
    <el-card>
      <el-table v-loading="listLoading" row-key="$index" style="width:100%" :data="list" :default-sort="{prop: 'addTime', order: 'descending'}" fit highlight-current-row @row-dblclick="showAudit">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="projectName" />
        <el-table-column label="提交时间" align="center" prop="addTime" sortable min-width="145px">
          <template slot-scope="{row}">
            <i class="el-icon-time" />
            <span>{{ new Date(row.addTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" align="center" prop="updateTime" sortable min-width="145px">
          <template v-if="scope.row.updateTime" slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ new Date(scope.row.updateTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          prop="whetherThrough"
          sortable
          :filters="[{ text: '待审核', value: '正在申请中' }, { text: '审核未通过', value: '正在施工中' },{ text: '审核通过', value: '已安装' }]"
          :filter-method="filterStatus"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.whetherThrough === 0 ? 'success':'danger'">{{ scope.row.whetherThrough === 0 ? '通过':'未通过' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleAudit(scope.row.id)">审核</el-button>
            <el-button size="mini" type="warning" @click="handleRead(scope.row.id)">查看</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination style="margin-top:20px" background layout="prev, pager, next, total,sizes,jumper" :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
  </div>
</template>

<script>
import Community from '@/api/community'
import { notEmptyArray } from '@/utils'
export default {
  name: 'AuditedList',
  data() {
    return {
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 30
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

  },
  created() {
    // this.listApplies()
  },
  methods: {
    // 获取已审核列表
    async listApplies(query = {}) {
      this.listLoading = true
      await Community.auditHistorylist({ page: this.pagination.pageIndex - 1, size: this.pagination.pageSize }, query).then(res => {
        if (notEmptyArray(res.content)) {
          this.list = res.content
          this.pagination.total = res.totalElements
        } else {
          this.list = []
          this.pagination.total = 0
        }
      }).catch(() => {
        this.$message.error('数据获取失败')
      })
      this.listLoading = false
    },
    handleAudit() {},
    handleRead() {},
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.listApplies()
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
      this.listApplies()
    },
    showAudit(row) {
      // audited-detail
      const reg = /\/(.*)\//
      const prefix = this.$route.fullPath.match(reg)[1]
      const path = `/${prefix}/audited-detail`
      this.$router.push({ path, query: { id: row.id, status: row.statusId }})
    },
    filterStatus() {}
  }
}

</script>
<style scoped>
.filter__input {
  width: 200px;
  margin-bottom: 30px;
}
</style>
