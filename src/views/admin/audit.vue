<!--
 * @Author: zfd
 * @Date: 2020-12-09 08:27:43
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-29 16:02:09
 * @Description: 已审核列表
-->

<template>
  <div class="app-container">
    <el-input v-model="query.name" placeholder="单位名称" class="filter__input" @input="handleInput" />
    <el-card>
      <el-table v-loading="listLoading" row-key="$index" style="width:100%" :data="list" :default-sort="{prop: 'addTime', order: 'descending'}" fit highlight-current-row @row-dblclick="showAudit">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="companyName" />
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
        <el-table-column
          label="状态"
          align="center"
          prop="checked"
          :filters="[{ text: '待审核', value: 0 }, { text: '审核未通过', value: 2 },{ text: '审核通过', value: 1 }]"
          :filter-method="handleFilter"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.checked | keyToVal(checkType)">{{ scope.row.checked | keyToVal(checkStatus) }}</el-tag>

          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.checked === 0" size="mini" type="info" plain @click="handleOperation(scope.row.userId, 'audit')">审核</el-button>
            <el-button size="mini" type="warning" plain @click="handleOperation(scope.row.userId, 'read')">查看</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination style="margin-top:20px" background layout="prev, pager, next, total,sizes,jumper" :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { companyAduitApi } from '@/api/operations'
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
        name: '',
        checked: null
      },
      list: [],
      listLoading: false,
      lastTick: null
    }
  },
  computed: {
    ...mapState('common', ['checkType', 'checkStatus'])

  },
  created() {
    this.listApplies()
  },
  methods: {
    // 获取已审核列表
    async listApplies(pagination = {}, query = {}) {
      const { pageIndex = this.pagination.pageIndex - 1, size = this.pagination.pageSize } = pagination

      this.listLoading = true
      await companyAduitApi({ page: pageIndex, size }, query)
        .then(data => {
          const { content, totalElements } = data
          this.list = content
          this.pagination.total = totalElements
        }).catch(() => {
          this.$message.error('数据获取失败')
        })
      this.listLoading = false
    },
    handleInput(val) {
      if (this.lastTick === null || +new Date() - this.lastTick > 500 || val.length === 0) {
        this.listApplies({ pageIndex: 0, size: this.pagination.pageSize }, this.query)
        this.lastTick = +new Date()
      }
    },
    handleOperation(id, type) {
      this.$router.push({ name: 'AdminAuditDetail', params: { id, type }})
    },
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
    handleFilter(value, row, column) {
      const property = column['property']
      return row[property] === value
    }
  }
}

</script>
<style scoped>
.filter__input {
  width: 200px;
  margin-bottom: 30px;
}
</style>
