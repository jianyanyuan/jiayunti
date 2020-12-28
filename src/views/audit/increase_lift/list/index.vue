<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-22 10:15:27
 * @Description:图审列表
-->

<template>
  <div class="app-container">
    <div class="list-query-public">
      <el-form ref="queryForm" :inline="true" :model="query" size="small">
        <el-form-item label="编号" prop="Name " style="margin-right: 30px">
          <el-input v-model="query.code" />
        </el-form-item>
        <el-form-item label="申请人" prop="applyName " style="margin-right: 30px">
          <el-input v-model="query.applyName" />
        </el-form-item>
        <!-- <el-form-item label="设计单位" prop="designName " style="margin-right: 30px">
          <el-input v-model="query.designName" />
        </el-form-item> -->
        <el-form-item label="状态" prop="status " style="margin-right: 30px">
          <el-select v-model="query.status">
            <el-option v-for="item in designStatus" :key="item.val" :label="item.val" :value="item.key" />
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
      <el-table v-loading="listLoading" class="design-table" @expand-change="handleExpand" :data="list" element-loading-text="Loading" fit highlight-current-row :default-sort="{prop: 'addTime', order: 'descending'}" >
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-form label-position="left" v-loading="expandLoading" inline class="demo-table-expand">
              <el-form-item label="申请人">
                {{ row.apply.applicantName }}
              </el-form-item>
              <el-form-item label="申请时间">
                {{ row.apply.createTime }}
              </el-form-item>
              <el-form-item label="用户地址">
                {{ row.apply.address }}
              </el-form-item>
              <el-form-item label="电话">
                {{ row.apply.phoneNumber }}
              </el-form-item>
              <el-form-item label="加装电梯地址">
                {{ row.apply.location }}
              </el-form-item>
              <el-form-item label="设计单位">
                {{ row.apply.designName }}
              </el-form-item>
              <el-form-item label="设备">
                {{ row.apply.device }}
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="projectName" min-width="200" align="center" />
        <el-table-column label="申请人" min-width="200" align="center">
          <template slot-scope="{row}">
            {{ row.applicantName }}
          </template>
        </el-table-column>
        <el-table-column label="提交时间" align="center" prop="addTime" sortable min-width="145px">
          <template slot-scope="{row}">
            <i class="el-icon-time" />
            <span>{{ new Date(row.addTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最新处理时间" align="center" prop="updateTime" sortable min-width="145px">
          <template v-if="row.updateTime" slot-scope="{row}">
            <i class="el-icon-time" />
            <span>{{ new Date(row.updateTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="statusId" sortable>
          <template slot-scope="{row}">
            <el-tag :type="row.statusId | keyToVal(applyTag)">{{ row.statusId | keyToVal(applyStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">

          <template slot-scope="{row}">
            <el-row type="flex" justify="space-around">
              <el-button v-if="row.statusId=== 10" size="mini" plain type="warning" @click="$router.push({name:'IncreaseLiftReport',params:{id:row.id,status:row.statusId}})">上传报告</el-button>
              <el-button v-if="row.statusId=== 5" size="mini" plain type="warning" @click="$router.push({name:'IncreaseLiftPipe',params:{id:row.id,status:row.statusId}})">管道踏勘</el-button>
              <el-button v-if="row.statusId === 11" size="mini" plain type="warning" @click="$router.push({path:'/increase-lift/fault-detail',query:{id:row.id,status:row.statusId}})">违规查看</el-button>
              <el-button v-if="row.statusId === 12" size="mini" plain type="warning" @click="$router.push({path:'/increase-lift/bonus',query:{id:row.id,status:row.statusId}})">补贴派发</el-button>

            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination style="margin-top:20px" background layout="prev, pager, next, total,sizes,jumper" hide-on-single-page :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <!-- 查看流程 -->
    <!-- <el-dialog v-el-drag-dialog title="流程图" center :visible.sync="flowVisible" :close-on-click-modal="false" min-width="1000px">
      <flow />
    </el-dialog> -->
  </div>
</template>

<script>
import index from './index'
export default {
  ...index
}
</script>
<style lang="scss" scoped>
.uploadModal ::v-deep .el-upload-dragger {
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
.uploadModal ::v-deep .el-upload-dragger:hover {
  background: #f6f6f6;
}
.uploadModal ::v-deep .el-dialog__body {
  text-align: center;
}

.expand-info ::v-deep .el-card__header {
  background: #409eff;
  color: #fff;
}
.demo-table-expand {
  font-size: 0;
}
.design-table {
  width: 100%;
  margin-bottom: 30px;
}
.design-table .demo-table-expand ::v-deep label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 150px;
  margin-bottom: 0;
  width: 100%;
}
.uploadModal ::v-deep .el-upload-dragger {
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
.uploadModal ::v-deep .el-upload-dragger:hover {
  background: #f6f6f6;
}
.uploadModal ::v-deep .el-dialog__body {
  text-align: center;
}
</style>
