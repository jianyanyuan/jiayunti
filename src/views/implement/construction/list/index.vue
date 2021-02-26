<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:26:39
 * @Description:图审列表
-->

<template>
  <div class="app-container">
    <FilterList :status="conStatus" @listFn="listApplies" />
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
          <template v-if="scope.row.updateTime" slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ new Date(scope.row.updateTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="statusId" sortable>
          <template slot-scope="{row}">
            <el-tag :type="row.statusId | keyToVal(applyTag)">{{ row.statusId | keyToVal(applyStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" min-width="200px">

          <template slot-scope="{row}">
            <el-row type="flex" justify="space-around">
              <el-button v-if="+row.statusId < 12" size="mini" type="warning" plain @click="openUpload(row.id)">现场照片</el-button>
              <!-- <el-button v-if="row.statusId === 11" size="mini" type="success" plain >开始施工</el-button> -->

              <el-button v-if="row.statusId === 11" size="mini" type="warning" plain @click="$router.push({name:'ConstructionFault',params:{id:row.id,status:row.statusId}})">违规查看</el-button>
              <el-button v-if="row.statusId === 11" size="mini" type="warning" plain @click="willComplete(row)">竣工验收</el-button>

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
    <el-dialog center title="现场照片" :visible.sync="uploadVisible" :close-on-click-modal="false" class="uploadModal">
      <el-upload ref="upload" :file-list="uploadList" action="#" :on-remove="handleUploadRemove" :on-change="handleUploadChange" drag :auto-upload="false">
        <div>将文件拖到此处，或点击添加</div>
        <div>单个文件大小不超过20MB，可上传图片或PDF</div>
      </el-upload>
      <span slot="footer">
        <el-button size="small" type="primary" @click="handleUpload">上 传</el-button>
      </span>

    </el-dialog>
  </div>
</template>

<script>
import index from './index'
export default {
  ...index
}
</script>
<style scoped lang="scss">

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
