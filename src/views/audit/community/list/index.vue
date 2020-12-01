<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-01 16:25:34
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
        <el-form-item label="状态" prop="statusId " style="margin-right: 30px">
          <el-select v-model="query.statusId">
            <el-option v-for="item in statusOptions" :key="item.val" :label="item.val" :value="item.key" />
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
    <el-table v-loading="listLoading" style="width:100%;margin-bottom:30px" :data="list" :default-sort="{prop: 'applyTime', order: 'ascending'}" element-loading-text="Loading" fit highlight-current-row @row-dblclick="flowView">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="projectName" />
      <el-table-column label="提交时间" align="center" prop="addTime" sortable min-width="145px">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ new Date(scope.row.addTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新处理时间" align="center" prop="updateTime" sortable min-width="145px">
        <template v-if="scope.row.updateTime" slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ new Date(scope.row.updateTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="statusId" sortable>
        <template slot-scope="scope">
          <el-tag :type="scope.row.statusId | keyToVal(applyTag)">{{ scope.row.statusId | keyToVal(applyStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around">
            <el-button size="mini" type="warning" @click="$router.push({name:'CommunityCheck',params:{applyId: scope.row.Id, statusId: scope.row.statusId}})">审核</el-button>
            <el-button v-if="scope.row.statusId === 3" size="mini" type="info" @click="$router.push({path:'/community/record',query:{applyId:scope.row.Id}})">异议记录</el-button>
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
import index from './index'
export default {
  ...index
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
