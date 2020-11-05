<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-02 10:54:04
 * @Description:图审列表
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
        <el-form-item label="设计单位" prop="designName " style="margin-right: 30px">
          <el-input v-model="query.designName" />
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
    <el-table v-loading="listLoading" class="design-table" :data="list" element-loading-text="Loading" fit highlight-current-row :default-sort="{prop: 'status', order: 'ascending'}" @row-dblclick="flowView">
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <!-- <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-card style="margin-bottom:30px" class="expand-info">
            <div slot="header">
              <span>设计信息</span>
            </div>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="设计单位">
                <span>{{ row.design.org }}</span>
              </el-form-item>
              <el-form-item label="时间">
                <span>{{ row.design.time }}</span>
              </el-form-item>
              <el-form-item label="详细地址">
                <span>{{ row.design.address }}</span>
              </el-form-item>
              <el-form-item label="电话">
                <span>{{ row.design.phone }}</span>
              </el-form-item>
            </el-form>
          </el-card>
          <el-card style="margin-bottom:30px" class="expand-info">
            <div slot="header">
              <span>申请信息</span>
            </div>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="申请人">
                <span>{{ row.apply.name }}</span>
              </el-form-item>
              <el-form-item label="详细地址">
                <span>{{ row.apply.address }}</span>
              </el-form-item>
              <el-form-item label="电话">
                <span>{{ row.apply.phone }}</span>
              </el-form-item>
              <el-form-item label="加装电梯地址">
                <span>{{ row.apply.liftAddress }}</span>
              </el-form-item>
              <el-form-item label="设备规格">
                <span>{{ row.apply.spec }}</span>
              </el-form-item>
            </el-form>
          </el-card>
        </template>
      </el-table-column> -->
      <el-table-column label="编号" prop="code" align="center" />
      <el-table-column label="申请人" min-width="200" align="center">
        <template slot-scope="{row}">
          {{ row.apply.name }}
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="apply.time" sortable align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.apply.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设计单位" align="center">
        <template slot-scope="{row}">
          <span>{{ row.design.org }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="设计时间" min-width="200" prop="design.time" sortable align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.design.time }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="审核时间" prop="auditTime" sortable align="center">
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
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around">
            <el-button v-if="scope.row.status === 6" size="mini" type="warning">
              <router-link :to="{path:'/drawing_audit/check',query:{applyId:scope.row.Id}}">审 核</router-link>
            </el-button>

          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, total,sizes,jumper" hide-on-single-page :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <el-dialog center title="上传" :visible.sync="uploadModal.visible" :close-on-click-modal="false" class="uploadModal">
      <el-upload ref="upload" action="/api/co/Attachment/UploadAttachment" :before-upload="uploadBefore" :on-success="uploadSuccess" :on-remove="uploadRemove" :on-error="uploadError" list-type="picture" drag multiple :auto-upload="false">
        <!-- <i class="el-icon-upload" /> -->
        <div>将文件拖到此处，或点击添加</div>
        <p>单个文件大小不超过20MB，可上传图片或PDF</p>
      </el-upload>
      <span slot="footer">
        <el-button size="small" type="primary" @click="submitUpload">上传设计图</el-button>
      </span>

    </el-dialog>
    <el-dialog v-el-drag-dialog title="流程图" center :visible.sync="flowVisible" :close-on-click-modal="false" min-width="1000px">
      <flow />
    </el-dialog>
    <!-- <div>
      <p>联系方式</p>
      <p>审核单位：XXX图审机构 审核人员：XXX 联系电话：0512XXXX 工作时间：周一至周五 9:00-11:00 14:00-17:00</p>
    </div> -->
  </div>
</template>

<script>
import { keyToVal } from '@/utils'
import { mapState } from 'vuex'
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
      flowVisible: false,
      query: {
        code: '',
        applyName: '',
        designName: '',
        status: ''
      },
      list: [
        {
          code: 'xxx小区xxxx幢xxx单元',
          auditTime: '',
          apply: {
            name: '李先生',
            address: '苏州高新区',
            phone: '15988800323',
            liftAddress: '小区1楼',
            spec: '高端电梯',
            time: '2020-10-12 10:56'
          },
          design: {
            org: '建研院',
            time: '2020-10-12 10:56',
            address: '苏州高新区',
            phone: '15988800323'
          },
          status: 6 // 施工图审核
        }

        // {
        //   code: 'apply10140900',
        //   designTime: '2020-10-14 10:56',
        //   auditTime: '2020-10-14 10:56',
        //   apply: {
        //     name: '李先生',
        //     address: '苏州高新区',
        //     phone: '15988800323',
        //     liftAddress: '小区1楼',
        //     spec: '高端电梯',
        //     time: '2020-10-14 09:00'
        //   },
        //   design: {
        //     org: '建研院',
        //     time: '2020-10-12 10:56',
        //     address: '苏州高新区',
        //     phone: '15988800323'
        //   },
        //   status: 3 // 审核通过
        // }
      ],
      listLoading: false,
      designStatus: [
        { key: 0, val: '未审核' },
        { key: 1, val: '审核未通过' },
        { key: 2, val: '审核通过' }
      ],
      designTag: [
        { key: 0, val: 'info' },
        { key: 1, val: 'danger' },
        { key: 2, val: 'success' }
      ],
      pagination: {
        total: 20,
        pageIndex: 1,
        pageSize: 10
      },
      uploadModal: {
        visible: false
      }
    }
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag'])

  },
  created() {
  },
  methods: {
    flowView() {
      this.flowVisible = true
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
    },
    // 图片上传之前判断
    uploadBefore(file) {
      const fileType = file.type
      const isImage = fileType.indexOf('image') !== -1
      const isBig = file.size <= 1024 * 1024 * 10
      if (!file) {
        this.$refs.upload.onError()
        this.$message.error('上传为空！')
        return false
      }
      if (!isImage) {
        this.$refs.upload.onError()
        this.$message.error('只能上传图片！')
        return false
      }
      if (!isBig) {
        this.$refs.upload.onError()
        this.$message.error('图片大小不能超过10MB！')
        return false
      }
      return true
    },
    // 图片上传成功之后回传
    uploadSuccess(res) { },
    // 图片上传失败
    uploadError() {
      this.$message.error('上传失败！')
    },
    // 图片移除
    uploadRemove(file) { },
    // 手动上传
    submitUpload() {
      this.$refs.upload.submit()
    }
  }
}
</script>
<style lang="scss" scoped>
 .manage-query {
  height: 45px;
  padding: 5px 20px;
  background: #efefef;
  border-bottom: 1px solid #ddd;
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
