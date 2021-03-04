<!--
 * @Author: zfd
 * @Date: 2020-12-17 13:51:32
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:27:26
 * @Description: 监理单位列表
-->
<template>
  <div class="app-container">
    <FilterList @listFn="listApplies" />
    <el-card>
      <el-table v-loading="listLoading" row-key="$index" style="width:100%" :data="list" :default-sort="{prop: 'addTime', order: 'descending'}" fit highlight-current-row>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
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
        <el-table-column align="center" label="操作" min-width="145px">
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

</style>
