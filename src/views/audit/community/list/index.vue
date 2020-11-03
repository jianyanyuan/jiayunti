<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-03 08:49:43
 * @Description:申请列表
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
        <el-form-item label="状态" prop="status " style="margin-right: 30px">
          <el-select v-model="query.status">
            <el-option v-for="item in designStatus" :key="item.val" :label="item.val" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="goSearch">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" icon="el-icon-circle-close" @click="clearQuery">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="listLoading" style="width:100%;margin-bottom:30px" :data="list" :default-sort="{prop: 'applyTime', order: 'ascending'}" element-loading-text="Loading" fit highlight-current-row @row-dblclick="flowView">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="code" align="center" />
      <el-table-column label="提交时间" align="center" prop="applyTime" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" align="center" prop="auditTime" sortable>
        <template v-if="scope.row.auditTime" slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.auditTime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" align="center" prop="status" sortable>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | keyToVal(applyTag)">{{ scope.row.status | keyToVal(applyStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around">
            <el-button size="mini" type="warning" @click="$router.push({name:'CommunityCheck',params:{applyId: scope.row.Id, status: scope.row.status}})">审核</el-button>
            <el-button v-if="scope.row.status === 3" size="mini" type="info" @click="$router.push({path:'/community/record',query:{applyId:scope.row.Id}})">异议记录</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, total,sizes,jumper" hide-on-single-page :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />

    <!-- 查看流程 -->
    <el-dialog v-el-drag-dialog title="流程图" center :visible.sync="flowVisible" :close-on-click-modal="false" min-width="1000px">
      <flow />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { keyToVal } from '@/utils'
import Flow from '@/components/street/Flow'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
export default {
  filters: {
    keyToVal
  },
  components: {
    Flow
  },
  directives: {
    elDragDialog
  },
  data() {
    return {
      pagination: {
        total: 20,
        pageIndex: 1,
        pageSize: 10
      },
      query: {
        code: '',
        applyName: '',
        status: ''
      },
      list: [
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:56',
          auditTime: '2020-10-14 10:56',
          status: 1 // 社区受理
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-13 11:46',
          auditTime: '2020-10-14 10:56',
          status: 3 // 公示阶段
        }
      ],
      listLoading: false,
      isFinished: false,
      flowVisible: false,
      model: {
        title: '踏勘记录',
        visible: false,
        tableData: [
          {
            project: '线路',
            company: '',
            isComplete: false,
            time: '',
            result: ''
          },
          {
            project: '建筑',
            company: '',
            isComplete: false,
            time: '',
            result: ''
          },
          {
            project: '水管',
            company: '',
            isComplete: false,
            time: '',
            result: ''
          }
        ]
      }
    }
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag'])
  },
  created() {
  },
  methods: {
    goSearch() { },
    clearQuery() { },
    flowView() {
      this.flowVisible = true
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
    },
    saveRecord() {
      const isFinished = this.model.tableData.filter(v => {
        return !v.isComplete
      })
      if (isFinished.length === 0) {
        this.isFinished = true
      } else {
        this.isFinished = false
        this.model.visible = false
      }
    },
    completed() {
      this.model.visible = false
    }
  }
}
</script>
<style scoped>
.manage-query {
  height: 45px;
  padding: 5px 20px;
  background: #efefef;
  border-bottom: 1px solid #ddd;
}
</style>
