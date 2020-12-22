<!--
 * @Author: zfd
 * @Date: 2020-12-22 10:55:27
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-22 15:20:17
 * @Description: 
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="device-left">
          <el-input placeholder="搜索设备" v-model="treeKey">
            <el-button slot="append" icon="el-icon-search" @click="filterDevice"></el-button>
          </el-input>
          <div class="device-tree">
            <div class="device-tree-btn">
              <el-button size="medium" @click="appendDevice">新增</el-button>
            </div>
            <el-tree style="min-height:500px" @check="filterApply" :data="data" ref="tree" :filter-node-method="filterNode" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps">
              <span slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span class="custom-tree-node">
                  <el-button v-if="data.children" type="text" size="mini" @click.stop="() => appendDevice(data)">
                    新增
                  </el-button>
                  <el-popconfirm title="确认删除该设备吗？" @onConfirm="removeDevice(data)">
                    <el-button slot="reference" size="mini" type="text">删除</el-button>
                  </el-popconfirm>

                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="device-right">
          <div class="list-query-public">
            <el-form ref="queryForm" :inline="true" :model="query" size="small">
              <el-form-item label="编号" prop="Name " style="margin-right: 30px">
                <el-input v-model="query.code" />
              </el-form-item>
              <el-form-item label="申请人" prop="applyName " style="margin-right: 30px">
                <el-input v-model="query.applyName" />
              </el-form-item>
              <el-form-item label="状态" prop="status " style="margin-right: 30px">
                <!-- <el-select v-model="query.status">
                  <el-option v-for="item in designStatus" :key="item.val" :label="item.val" :value="item.key" />
                </el-select> -->
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
            <el-table v-loading="listLoading" class="design-table" @expand-change="handleExpand" :data="list" element-loading-text="Loading" fit highlight-current-row :default-sort="{prop: 'addTime', order: 'descending'}">
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

            </el-table>
          </el-card>
          <el-pagination style="margin-top:20px" background layout="prev, pager, next, total,sizes,jumper" hide-on-single-page :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />

        </div>
      </el-col>
    </el-row>
    <!-- 新增设备 -->
    <el-dialog v-el-drag-dialog title="新增设备" :visible.sync="model.visible" :close-on-click-modal="false" width="600px" top="10vh" @close="resetFrom('form')">
      <el-form ref="form" v-loading="formLoading" :model="model.form" :rules="model.rules" label-width="120px">
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="model.form.brand" auto-complete="off" :disabled="model.disable" />
        </el-form-item>
        <el-form-item label="型号" prop="type">
          <el-input v-model="model.form.type" auto-complete="off">
            <span slot="append">kg</span>
          </el-input>
        </el-form-item>

      </el-form>
      <div style="text-align:center">
        <el-button @click="model.visible = false">取 消</el-button>
        <el-button type="primary" @click="postDevice">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
export default {
  name: 'DeviceList',
  data() {
    return {
      treeKey: '',
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      query: {
        code: '',
        applyName: '',
        status: ''
      },
      formLoading: false,
      model: {
        visible: false,
        form: {},
        disable:false,
        rules: {
          brand: [{ required: true, message: '请输入设备品牌',trigger:'blur' }],
          type: [{ required: true, message: '请输入设备型号',trigger:'blur' }]
        }
      },
      list: [],
      listLoading: false,
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      expandLoading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // // 获取申请列表
    // async listApplies() {
    //   this.listLoading = true
    //   await listApi({ page: this.pagination.pageIndex - 1, size: this.pagination.pageSize }).then(res => {
    //     if (notEmptyArray(res.content)) {
    //       res.content.forEach(v => {
    //         v.apply = {}
    //         this.list.push(v)
    //       })
    //       this.pagination.total = res.totalElements
    //     }
    //   }).catch(err => {
    //     this.$message.error('数据获取失败')
    //     console.log(err)
    //   })
    //   this.listLoading = false
    // },
    async handleExpand(row, expandedRows) {
      if (Object.keys(row.apply).length === 0) {
        this.expandLoading = true
        const apply = await this.$store.dispatch('getProjectBasic', row.id)
        const idx = this.list.findIndex(v => v.id === row.id)
        this.$set(this.list[idx], 'apply', apply)
        this.expandLoading = false
      }
    },
    postDevice() {

    },
    goSearch() { },
    clearQuery() { },
    removeDevice() { },
    appendDevice(data) {
      console.log(data)
      // const newChild = { id: Date.now(), label: 'testtest', children: [] };
      // if (!data.children) {
      //   this.$set(data, 'children', []);
      // }
      // data.children.push(newChild);
      if(data.children) {
        this.model.form.brand = data.label
        this.model.disable = true
      }
      this.model.visible = true
    },
    resetFrom(formName) {
      this.model.form = {}
      this.$refs[formName].clearValidate()
            this.model.disable = false
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    filterDevice() {
      this.$refs.tree.filter(this.treeKey)
    },
    filterApply(node, state) {
      console.log(state.checkedKeys)
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-tree-node ::v-deep .el-button--text {
  font-size: 14px;
  color: #7f8489;

  &:nth-of-type(1) {
    margin: 0 10px;
  }
}
.device-tree-btn {
  margin-bottom: 20px;
}
.device-tree {
  margin-top: 20px;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
</style>