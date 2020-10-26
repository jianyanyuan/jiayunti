<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-26 13:56:01
 * @Description:街道施工违规处理
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
    <el-table v-loading="listLoading" class="design-table" :data="list" element-loading-text="Loading" border fit highlight-current-row :default-sort="{prop: 'status', order: 'ascending'}">
      <el-table-column align="center" label="序号" min-width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <!-- <el-card style="margin-bottom:30px" class="expand-info">
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
          </el-card> -->
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
      </el-table-column>
      <el-table-column label="编号" prop="code" min-width="200" align="center" />
      <el-table-column label="申请人" min-width="200" align="center">
        <template slot-scope="{row}">
          {{ row.apply.name }}
        </template>
      </el-table-column>
      <el-table-column label="申请时间" min-width="200" prop="apply.time" sortable align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.apply.time }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="设计单位" min-width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.design.org }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设计时间" min-width="200" prop="design.time" sortable align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.design.time }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="违规时间" min-width="200" prop="auditTime" sortable align="center">
        <template v-if="scope.row.auditTime" slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.auditTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" sortable min-width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | keyToVal(designTag)">{{ scope.row.status | keyToVal(designStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="250">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around">
            <el-button size="mini" type="warning" @click="$router.push({path:'/street/supervise',query:{applyId:scope.row.Id}})">查看</el-button>
            <el-button size="mini" type="warning" @click="$router.push({path:'/street/handle_default',query:{applyId:scope.row.Id}})">处理</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, total,sizes,jumper" hide-on-single-page :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
  </div>
</template>

<script>
import { keyToVal } from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  filters: {
    keyToVal
  },
  directives: {
    elDragDialog
  },
  components: {
  },
  data() {
    return {
      query: {
        code: '',
        applyName: '',
        designName: '',
        status: ''
      },
      flowVisible: false,
      list: [
        {
          code: 'apply10121056',
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
          status: 0 // 未审核
        },
        {
          code: 'apply10131146',
          designTime: '2020-10-14 10:56',
          auditTime: '2020-10-14 10:56',
          apply: {
            name: '李先生',
            address: '苏州高新区',
            phone: '15988800323',
            liftAddress: '小区1楼',
            spec: '高端电梯',
            time: '2020-10-13 11:46'
          },
          design: {
            org: '建研院',
            time: '2020-10-12 10:56',
            address: '苏州高新区',
            phone: '15988800323'
          },
          status: 1 // 审核未通过
        },
        {
          code: 'apply10140800',
          designTime: '2020-10-14 10:56',
          auditTime: '2020-10-14 10:56',
          apply: {
            name: '李先生',
            address: '苏州高新区',
            phone: '15988800323',
            liftAddress: '小区1楼',
            spec: '高端电梯',
            time: '2020-10-14 08:00'
          },
          design: {
            org: '建研院',
            time: '2020-10-12 10:56',
            address: '苏州高新区',
            phone: '15988800323'
          },
          status: 2 // 审核通过
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
  },
  created() {
  },
  methods: {
    goSearch() {

    },
    clearQuery() {

    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
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
