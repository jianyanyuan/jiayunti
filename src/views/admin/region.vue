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
      <el-col :span="10">
        <div class="device-left">
          <el-input v-model="treeKey" placeholder="搜索设备">
            <el-button slot="append" icon="el-icon-search" @click="filterDevice" />
          </el-input>
          <div class="device-tree">
            <el-tree ref="tree" style="min-height:500px" :data="treeData" :filter-node-method="filterNode" node-key="id" :props="defaultProps" @check="filterApply" @node-click="handleQuery">
              <span slot-scope="{ node,data }">
                <span>{{ node.label }}</span>
                <span class="custom-tree-node">
                  <el-button v-if="data.children" type="text" size="mini" @click.stop="() => appendDevice(data)">
                    新增
                  </el-button>
                  <el-button type="text" size="mini">修改</el-button>

                  <el-button type="text" size="mini">禁用</el-button>
                  <!-- <el-button slot="reference" size="mini" type="text">禁用</el-button> -->

                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <el-button size="medium" style="margin-bottom:30px" @click="openAdd">新增</el-button>

      </el-col>
    </el-row>
    <!-- 新增操作 -->
    <el-dialog v-el-drag-dialog :title="model.title" :visible.sync="model.visible" :close-on-click-modal="false" width="600px" top="10vh" @close="resetFrom('form')">
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
        <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import { mapState } from 'vuex'
import { addApi, listApi, updateApi } from '@/api/operations'
import { notEmptyArray } from '@/utils'
// 不用递归，迭代性能更好
// const idxMap = ['streets', 'communities']

// function recursionAddress(parent, parentObj, i = 0) {

//   for (const child of parent[idxMap[i]]) {
//     const middleObj = { id: child.id, label: child.name, children: null }
//     if (parentObj.children === null) {
//       parentObj.children = [middleObj]
//     } else {
//       parentObj.children.push(middleObj)
//     }
//     if (i < idxMap.length - 1 && parent.streets !== undefined) {
//       recursionAddress(child, middleObj, ++i)
//     }
//     i = 0
//   }
// }
export default {
  name: 'AdminSetting',
  data() {
    return {
      treeKey: '',
      operationsData: {},

      formLoading: false,
      model: {
        visible: false,
        form: {
          isValid: true,
          s: 'small',
          t: 'warning'
        },
        title: '新增操作',
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
      district: null,
      role: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    treeData() {
      const cities = this.$store.state.common.address
      if (!notEmptyArray(cities)) {
        return ''
      }
      const data = []
      // 区街道社区
      try {
        // 只做苏州一个市的
        // 迭代性能更好
        for (const area of cities[0].areas) {
          const areaObj = { id: area.id, label: area.name, children: [] }
          for (const street of area.streets) {
            const streetObj = { id: street.id, label: street.name, children: [] }
            areaObj.children.push(streetObj)
            // if (areaObj.children === null) {
            //   areaObj.children = [streetObj]
            // } else {
            //   areaObj.children.push(streetObj)
            // }
            for (const community of street.communities) {
              const communityObj = { id: community.id, label: community.name, children: null }
              streetObj.children.push(communityObj)
              // if (streetObj.children === null) {
              //   streetObj.children = [communityObj]
              // } else {
              //   streetObj.children.push(communityObj)
              // }
            }
          }
          data.push(areaObj)
        }
        return data
      } catch (err) {
        console.log(err)
        // )
        // console.log('地址')
        return []
      }
    }
  },
  created() {
    // this.initTree()
  },
  methods: {
    openAdd() {
      this.model.title = '新增操作'
      this.model.visible = true
    },
    openModify(operation) {
      this.model.title = '修改操作'
      this.model.visible = true
      this.model.form = operation
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.formLoading = true
          if (this.model.title === '新增操作') {
            await addApi(this.model.form)
              .then(() => {
                this.handleQuery(this.role, this.district)
              })
              .catch(err => {
                this.$message.error(err)
              })
          } else {
            await updateApi(this.model.form)
              .then(() => {
                this.handleQuery(this.role, this.district)
              })
              .catch(err => {
                this.$message.error(err)
              })
          }
          this.formLoading = false

          this.model.visible = false
        }
      })
    },
    resetFrom(formName) {
      this.model.form = {
        isValid: true,
        s: 'small',
        t: 'warning'
      }
      this.$refs[formName].clearValidate()
    },
    async handleQuery(role, district) {
      this.district = district.parent?.data.id || district
      this.role = role.val || role

      if (typeof (this.role) === 'string' && isFinite(+this.district)) {
        await this.$store.dispatch('user/getOperation', { district: this.district, role: this.role, setState: false })
          .then(operations => {
            this.operationsData = operations
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
