<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-30 09:28:21
 * @Description:图审列表
-->

<template>
  <div class="app-container">
    <FilterList :status="insStatus" @listFn="listApplies" />
    <el-card>
      <el-table v-loading="listLoading" class="table-expand-public" :data="list" element-loading-text="Loading" fit highlight-current-row :default-sort="{prop: 'addTime', order: 'descending'}" @expand-change="handleExpand">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-form label-position="left" inline class="expand-form-p">
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
              <el-form-item v-if="row.apply.principalName" label="代理人">
                {{ row.apply.principalName }}
              </el-form-item>
              <el-form-item v-if="row.apply.principalName" label="代理人电话">
                {{ row.apply.principalPhone }}
              </el-form-item>
              <el-form-item label="设计单位">
                {{ row.apply.designName || '' }}
              </el-form-item>
              <el-form-item label="设备">
                {{ row.apply.device || '' }}
              </el-form-item>
              <el-form-item label="施工单位">
                {{ row.apply.constructionName || '' }}
              </el-form-item>
              <el-form-item label="监理单位">
                {{ row.apply.supervisionName || '' }}
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

          <template slot-scope="scope">
            <el-row type="flex" justify="space-around">
              <el-button v-for="(btn,index) in getButtons(scope.row)" :key="index" :size="btn.s" :type="btn.t" plain @click="$router.push(btn.url)">{{ btn.o }}</el-button>

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
  </div>
</template>

<script>
import index from './index'
export default {
  ...index
}
</script>

