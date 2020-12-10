<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-10 15:31:54
 * @Description:设计列表
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
    <el-table v-loading="listLoading" class="design-table" @expand-change="handleExpand" :data="list" element-loading-text="Loading" fit highlight-current-row :default-sort="{prop: 'status', order: 'ascending'}" @row-dblclick="flowView">
      <el-table-column align="center" label="序号" min-width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="{ row }" v-if="row.apply" v-loading="expandLoading">
          <el-form label-position="left" inline class="demo-table-expand">
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
            <el-form-item label="设备">
              {{ row.apply.device }}
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="code" min-width="200" align="center" />
      <el-table-column label="申请人" min-width="200" align="center">
        <template slot-scope="{row}">
          {{ row.apply.name }}
        </template>
      </el-table-column>
      <el-table-column label="申请时间" min-width="200" sortable align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.apply.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设计时间" min-width="200" prop="designTime" sortable align="center">
        <template v-if="scope.row.designTime" slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.designTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" min-width="200" prop="auditTime" sortable align="center">
        <template v-if="scope.row.auditTime" slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.auditTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" sortable min-width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | keyToVal(applyTag)">{{ scope.row.status | keyToVal(applyStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around">
            <el-button v-if="scope.row.status === 2" type="primary" size="mini" @click="$router.push({name:'UploadDesign',params:{applyId:scope.row.Id,status:scope.row.status}})">上 传</el-button>

            <el-button v-if="scope.row.status === 5" type="primary" size="mini" @click="uploadModal.visible = true">上 传</el-button>
            <el-button v-if="scope.row.status === 6" size="mini" type="warning" @click="$router.push({path:'/designer/edit',query:{applyId:scope.row.Id}})">修 改</el-button>

          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, total,sizes,jumper" hide-on-single-page :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />

    <el-dialog center title="上传" :visible.sync="uploadVisible" :close-on-click-modal="false" class="uploadModal">
      <el-upload action="#" class="form-card" :on-remove="handleUploadRemove" :on-change="handleUploadChange" drag :auto-upload="false">
        <div>将文件拖到此处，或点击添加</div>
        <div>单个文件大小不超过20MB，可上传图片或PDF</div>
      </el-upload>
      <span slot="footer">
        <el-button size="small" type="primary" @click="designUpload">上传设计图</el-button>
      </span>

    </el-dialog>
    <!-- <div>
      <p>联系方式</p>
      <p>审核单位：XXX图审机构 审核人员：XXX 联系电话：0512XXXX 工作时间：周一至周五 9:00-11:00 14:00-17:00</p>
    </div> -->
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
.demo-table-expand {
  font-size: 0;
}
.design-table {
  width: 100%;
  margin-bottom: 30px;
}
.design-table .demo-table-expand /deep/ label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 150px;
  margin-bottom: 0;
  width: 100%;
}
.uploadModal /deep/ .el-upload-dragger {
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
.uploadModal /deep/ .el-upload-dragger:hover {
  background: #f6f6f6;
}
.uploadModal /deep/ .el-dialog__body {
  text-align: center;
}
</style>
