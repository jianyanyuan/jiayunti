<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-04 09:02:17
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
      <el-table-column label="编号" prop="code" align="center" />
      <el-table-column label="申请人" align="center">
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
      <el-table-column label="审核时间" prop="auditTime" sortable align="center">
        <template v-if="scope.row.auditTime" slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.auditTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" sortable align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | keyToVal(applyTag)">{{ scope.row.status | keyToVal(applyStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around">
            <el-button v-if="scope.row.status=== 9" size="mini" type="warning" @click="$router.push({path:'/increase_lift/report',query:{applyId:scope.row.Id}})">上传报告</el-button>
            <el-button v-if="scope.row.status=== 4" size="mini" type="warning" @click="$router.push({path:'/increase_lift/pipe',query:{applyId:scope.row.Id}})">管道踏勘</el-button>
            <el-button v-if="scope.row.status === 11" size="mini" type="warning" @click="$router.push({name:'IncreaseLiftFaultView',params:{}})">违规查看</el-button>
            <el-button v-if="scope.row.status === 12" size="mini" type="warning" @click="subsidyVisible = true">补贴派发</el-button>

          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, total,sizes,jumper" hide-on-single-page :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <!-- 补贴派发 -->
    <el-dialog v-el-drag-dialog title="补贴派发" center :visible.sync="subsidyVisible" :close-on-click-modal="false" class="uploadModal">
      <el-form :model="model" :rules="model.rule">
        <el-form-item label="补助金额（元）:" prop="money">
          <el-input v-model="model.money" @blur="formatterDecimal" />
        </el-form-item>
        <el-form-item label="证明材料:" prop="attachment">
          <el-upload action="#" :on-remove="handleUploadRemove" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" list-type="picture" drag multiple :auto-upload="false">
            <!-- <i class="el-icon-upload" /> -->
            <div>将文件拖到此处，或点击添加</div>
            <p>单个文件大小不超过20MB</p>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="small" type="primary" @click="submitUpload">上 传</el-button>
      </span>
    </el-dialog>
    <!-- 查看流程 -->
    <el-dialog v-el-drag-dialog title="流程图" center :visible.sync="flowVisible" :close-on-click-modal="false" min-width="1000px">
      <flow />
    </el-dialog>
  </div>
</template>

<script>
import { keyToVal } from '@/utils'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
import Flow from '@/components/street/Flow'
import { mapState } from 'vuex'

export default {
  filters: {
    keyToVal
  },
  directives: {
    elDragDialog
  },
  components: {
    Flow
  },
  data() {
    const formatterDecimal = (rule, value, callback) => {
      const number = +value
      if (isNaN(number)) {
        callback('请输入补助金额,数字格式')
      } else {
        const reg = /(?=(\B\d{3})+$)/g
        this.model.money = value.toString().replace(reg, ',')
        callback()
      }
    }
    return {
      subsidyVisible: false,
      query: {
        code: '',
        applyName: '',
        designName: '',
        status: ''
      },
      flowVisible: false,
      model: {
        money: '',
        attachment: [],
        rule: {
          money: [{ required: true, validator: formatterDecimal, trigger: 'blur' }],
          attachment: [{ required: true }]
        }
      },
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
          status: 4 // 管道踏勘
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
          status: 9 // 联合审查
        },
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
          status: 11 // 施工中
        },
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
          status: 12 // 竣工验收
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
    goSearch() {

    },
    clearQuery() {

    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
    },
    handleUploadRemove(file, fileList) {
    },
    // handleUploadChange(file, fileList) {
    //   console.log(file)
    //   console.log(fileList)
    //   debugger
    // },

    // 上传文件发生改变时
    handleUploadChange(file, fileList, index) {
      if (fileList.length > 0) {
        this.model[index] = fileList.map(f => f.raw)
      }
    },
    // 图片上传之前判断
    uploadBefore(file) {
      const isImage = file.type.indexOf('image') !== -1
      const isBig = file.size <= 1024 * 1024 * 10
      if (!file) {
        this.$message.error('上传为空！')
        return false
      }
      if (!isImage) {
        this.$message.error('只能上传图片！')
        return false
      }
      if (!isBig) {
        this.$message.error('图片大小不能超过10MB！')
        return false
      }
      return true
    },
    submitUpload() {

    }

  }
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
