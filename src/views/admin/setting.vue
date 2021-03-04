<!--
 * @Author: zfd
 * @Date: 2020-12-22 10:55:27
 * @LastEditors: zfd
 * @LastEditTime: 2021-01-04 11:18:19
 * @Description:
-->
<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="device-left">
          <el-input v-model="treeKey" placeholder="搜索设备">
            <el-button slot="append" icon="el-icon-search" @click="filterDevice" />
          </el-input>
          <div class="device-tree">
            <el-tree ref="tree" style="min-height:500px" :data="treeData" :filter-node-method="filterNode" node-key="id" :props="defaultProps" @check="filterApply" @node-click="handleQuery">
              <span slot-scope="{ node,data }">
                <span>{{ node.label }}</span>
                <!-- <span class="custom-tree-node">
                  <el-button v-if="data.children" type="text" size="mini" @click.stop="() => appendDevice(data)">
                    新增
                  </el-button>
                  <el-popconfirm title="确认删除该设备吗？" @onConfirm="removeDevice(data)">
                    <el-button slot="reference" size="mini" type="text">删除</el-button>
                  </el-popconfirm>
                </span> -->
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <el-button size="medium" style="margin-bottom:30px" @click="openAdd">新增</el-button>

        <template v-for="(prop) in Object.keys($store.state.project.operations)">
          <el-card class="upload-card" style="margin-bottom:30px">
            <div slot="header">
              <span>{{ +prop | keyToVal(applyStatus) }}</span>
            </div>
            <el-collapse accordion>
              <el-collapse-item v-for="(operation,index) in $store.state.project.operations[prop]" :key="index">
                <template slot="title">
                  {{ operation.o }}
                  <el-button type="text" size="small" style="margin-left:30px" @click.stop="handleEdit">修改</el-button>
                </template>
                <el-form :inline="true" :model="operation" class="demo-form-inline">
                  <el-form-item label="页面名">
                    {{ operation.uN }}
                  </el-form-item>
                  <el-form-item label="角色">
                    <span v-for="role in operation.r" :key="role" style="margin-right:20px">{{ role }}</span>
                  </el-form-item>
                  <el-form-item label="按钮大小">
                    {{ operation.s }}
                  </el-form-item>
                  <el-form-item label="按钮类型">
                    {{ operation.t }}
                  </el-form-item>
                  <el-form-item label="按钮状态">
                    禁用
                  </el-form-item>
                </el-form>
              </el-collapse-item>
            </el-collapse>

          </el-card>
        </template>

      </el-col>
    </el-row>
    <!-- 新增操作 -->
    <el-dialog v-el-drag-dialog title="新增操作" :visible.sync="model.visible" :close-on-click-modal="false" width="600px" top="10vh" @close="resetFrom('form')">
      <el-form ref="form" v-loading="formLoading" :model="model.form" :rules="model.rules" label-width="120px">
        <el-form-item label="行政区" prop="district">
          <el-select v-model="model.form.district" filterable>
            <el-option v-for="item in districtOptions" :key="item.label" :value="item.id" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作名" prop="name">
          <el-input v-model="model.form.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="页面名称" prop="un">
          <el-input v-model="model.form.un" auto-complete="off" />
        </el-form-item>

        <el-form-item label="流程节点" prop="status">
          <el-select v-model="model.form.status" filterable>
            <el-option v-for="item in applyStatus" :key="item.val" :value="item.key" :label="item.val" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否有效" prop="isValid">
          <el-select v-model="model.form.isValid" filterable>
            <el-option v-for="item in isOrNo" :key="item.key" :value="item.key" :label="item.val" />
          </el-select>
        </el-form-item>
        <el-form-item label="按钮大小" prop="s">
          <el-select v-model="model.form.s" filterable>
            <el-option v-for="item in buttonSize" :key="item.val" :value="item.val" :label="item.val" />
          </el-select>
        </el-form-item>
        <el-form-item label="按钮类型" prop="t">
          <el-select v-model="model.form.t" filterable>
            <el-option v-for="item in statusType" :key="item.val" :value="item.val" :label="item.val" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="model.form.role" filterable>
            <el-option v-for="item in roles" :key="item.val" :value="item.val" :label="item.val" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="model.form.description" auto-complete="off" />

        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button @click="model.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { mapState } from 'vuex'
import { addApi, listApi, updateApi } from '@/api/operations'
import { notEmptyArray } from '@/utils'
export default {
  name: 'AdminSetting',
  data() {
    return {
      treeKey: '',
      operationsData: [],

      formLoading: false,
      model: {
        visible: false,
        form: {
          isValid: true,
          s: 'small',
          t: 'warning'
        },
        disable: false,
        rules: {
          name: [{ required: true, message: '请输入操作名', trigger: 'blur' }],
          role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
          district: [{ required: true, message: '请选择行政区', trigger: 'blur' }],
          isValid: [{ required: true, message: '请选择是否有效', trigger: 'blur' }],
          s: [{ required: true, message: '请选择按钮大小', trigger: 'blur' }],
          t: [{ required: true, message: '请选择按钮类型', trigger: 'blur' }],
          un: [{ required: true, message: '请输入页面名称', trigger: 'blur' }],
          status: [{ required: true, message: '请选择流程节点', trigger: 'blur' }],
          description: [{ required: true, message: '请输入操作描述', trigger: 'blur' }]

        }
      },
      list: [],
      listLoading: false,
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 30
      },
      expandLoading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapState('project', ['applyStatus', 'roles']),
    ...mapState('common', ['isOrNo', 'buttonSize', 'statusType']),
    treeData() {
      const address = this.$store.state.common.address
      const data = []
      const children = [
        { id: 'resident', label: '居民', val: 'ROLE_RESIDENT' },
        { id: 'trustee', label: '委托人', val: 'ROLE_PRINCIPAL' },
        { id: 'designer', label: '设计院', val: 'ROLE_DESIGNER' },
        { id: 'community', label: '社区', val: 'ROLE_COMMUNITY' },
        { id: 'increaseLift', label: '增梯办', val: 'ROLE_INCREASE_LIFT' },
        { id: 'drawingCheck', label: '图审', val: 'ROLE_DRAWING_AUDIT' },
        { id: 'street', label: '街道', val: 'ROLE_STREET' },
        { id: 'union', label: '联合审查', val: 'ROLE_UNION' },
        { id: 'construction', label: '施工单位', val: 'ROLE_CONSTRUCTION' },
        { id: 'supervision', label: '监管单位', val: 'ROLE_SUPERVISION' }
      ]
      if (Array.isArray(address[0]?.areas)) {
        for (const district of address[0].areas) {
          data.push({
            id: district.id,
            label: district.name,
            children: children.map(v => ({ id: district.id + v.id, label: v.label, val: v.val }))
          })
        }
      }
      return data
    },
    districtOptions() {
      const address = this.$store.state.common.address
      const data = []
      if (Array.isArray(address[0]?.areas)) {
        for (const district of address[0].areas) {
          data.push({
            id: district.id,
            label: district.name
          })
        }
      }
      return data
    }
  },
  created() {
    // this.initTree()
  },
  methods: {
    openAdd() {
      this.model.visible = true
    },
    handleAdd(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.formLoading = true
          await addApi(this.model.form).catch(err => {
            this.$message.error(err)
          })
          this.formLoading = false

          this.model.visible = false
        }
      })
    },
    resetFrom(formName) {
      this.model.form = { isValid: true,
        s: 'small',
        t: 'warning' }
      this.$refs[formName].clearValidate()
    },
    async handleQuery(obj, node, component) {
      const district = node.parent.data.id
      const role = obj.val
      if (role && district) {
        await listApi({ district, role })
          .then(operations => {
            const result = {}
            if (notEmptyArray(operations)) {
              for (const o of operations) {
                if (Array.isArray(result[o.status])) {
                  result[o.status].push({})
                }
              }
            }
          })
          .catch(errMsg => {
            this.$message.error(errMsg)
          })
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    filterDevice() {
      this.$refs.tree.filter(this.treeKey)
    },
    filterApply(node, state) {
      // console.log(state.checkedKeys)
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
</style>
