<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-29 14:06:02
 * @Description:街道审核列表
-->

<template>
  <div class="app-container">
    <FilterList :status="streetStatus" @listFn="listApplies" />
    <el-card>
      <el-table v-loading="listLoading" row-key="id" class="design-table" @expand-change="handleExpand" style="width:100%" :data="list" :default-sort="{prop: 'addTime', order: 'descending'}" fit highlight-current-row>
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
        <el-table-column label="编号" prop="projectName" />
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
        <el-table-column align="center" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-row type="flex" justify="space-around">
              <el-button v-if="scope.row.statusId === 9" size="mini" plain type="warning" @click="$router.push({name:'StreetCheck',params:{id:scope.row.id,status:scope.row.statusId}})">审 核</el-button>
              <el-button v-if="scope.row.statusId === 11" size="mini" plain type="info" @click="$router.push({path:'/street/fault-record',query:{id:scope.row.id,status:scope.row.statusId}})">违规记录</el-button>
              <el-button v-if="scope.row.statusId === 11" size="mini" plain type="warning" @click="$router.push({path:'/street/fault-review',query:{id:scope.row.id,status:scope.row.statusId}})">违规处理</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination style="margin-top:20px" background layout="prev, pager, next, total,sizes,jumper" :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <!-- 查看流程 -->
    <!-- <el-dialog v-el-drag-dialog title="流程图" center :visible.sync="flowVisible" :close-on-click-modal="false" min-width="1000px">
      <flow />
    </el-dialog> -->
    <!-- <div>
      <p>联系方式</p>
      <p>审核单位：XXX图审机构 审核人员：XXX 联系电话：0512XXXX 工作时间：周一至周五 9:00-11:00 14:00-17:00</p>
    </div> -->
  </div>
</template>

<script>
import index from './index'
export default {
  ...index
}
</script>
<style lang="scss" scoped>
.expand-info ::v-deep .el-card__header {
  background: #409eff;
  color: #fff;
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
