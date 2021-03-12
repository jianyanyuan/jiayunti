<!--
 * @Author: zfd
 * @Date: 2020-12-22 10:55:27
 * @LastEditors: zfd
 * @LastEditTime: 2021-01-04 11:18:19
 * @Description:
-->
<template>
  <div v-loading="pageLoading" class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="node-tree">
          <el-tree ref="tree" style="min-height:500px" :data="treeData" node-key="id">
            <span slot-scope="{ node,data }">
              <span>{{ node.label }}</span>
              <span class="custom-tree-node">
                <el-button v-if="data.children" type="text" size="mini" @click.stop="appendNode(data)">
                  新增
                </el-button>
                <el-button v-if="data.isValid !== undefined" type="text" size="mini" @click.stop="modifyNode(data,node)">
                  修改
                </el-button>
                <el-button v-if="data.isValid === true" size="mini" type="text" @click.stop="toogleNode(data,node,false)">禁用</el-button>
                <el-button v-else-if="data.isValid === false" size="mini" type="text" @click.stop="toogleNode(data,node,true)">启用</el-button>

              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <el-card v-show="model.visible" class="form-card">
          <el-form ref="form" :model="model.form" :rules="model.rules" label-width="120px">
            <el-form-item label="行政区" prop="district">
              {{ model.form.district | idToLabel(districtOptions) }}
            </el-form-item>
            <el-form-item label="节点名" prop="name">
              <el-input v-model="model.form.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="节点id" prop="status">
              <el-input-number v-model="model.form.status" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="是否为开始节点" prop="isStart">
              <el-select v-model="model.form.isStart" filterable>
                <el-option v-for="item in isOrNo" :key="item.key" :value="item.key" :label="item.val" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否有效" prop="isValid">
              <el-select v-model="model.form.isValid" filterable>
                <el-option v-for="item in isOrNo" :key="item.key" :value="item.key" :label="item.val" />
              </el-select>
            </el-form-item>

          </el-form>
          <div class="form-card__btn">
            <el-button @click="model.visible = false">取 消</el-button>
            <el-button type="primary" @click="handleSubmit('form')">确 定</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>

</template>
<script>
import { mapGetters, mapState } from 'vuex'
import { addNodeApi, updateNodeApi } from '@/api/operations'
export default {
  name: 'AdminSetting',
  filters: {
    idToLabel(key, options) {
      if (typeof (key) === 'undefined' || key === null || !Array.isArray(options)) {
        return ''
      }
      for (const i of options) {
        if (i.id === key) return i.label
      }
      return ''
    }
  },
  data() {
    return {
      treeKey: '',
      pageLoading: false,
      model: {
        visible: false,
        form: {
          isValid: false,
          isStart: false,
          name: '',
          district: ''
        },
        rules: {
          district: [{ required: true, message: '请输入所在行政区', trigger: 'blur' }],
          name: [{ required: true, message: '请输入节点名', trigger: 'blur' }],
          status: [{ required: true, message: '请输入节点id', trigger: 'blur' }],
          isStart: [{ required: true, message: '请选择是否为开始节点', trigger: 'blur' }],
          isValid: [{ required: true, message: '请选择是否有效', trigger: 'blur' }]
        }
      }
    }
  },
  computed: {
    ...mapState('common', ['isOrNo']),
    ...mapGetters('common', ['districtOptions']),
    treeData() {
      const applyStatus = this.$store.state.project.applyStatus
      const data = []
      for (const d of this.districtOptions) {
        const obj = { id: d.id, label: d.label, children: [] }
        for (const i in applyStatus) {
          const { district, key, val, isValid, isStart, id } = applyStatus[i]
          if (district === d.id) {
            const child = { id, label: val, isValid, isStart, status: key }
            // obj.children === null ? (obj.children = [child]) :
            obj.children.push(child)
          }
        }
        data.push(obj)
      }
      return data
    }
  },
  created() {
  },
  methods: {
    appendNode(data) {
      this.model.form = {
        isValid: true,
        isStart: false,
        name: '',
        district: data.id
      }
      this.model.visible = true
    },
    modifyNode(data, node) {
      this.model.form = data
      this.model.form.name = data.label
      this.model.form.district = node.parent.data.id
      this.model.visible = true
    },
    async toogleNode(data, node, isValid) {
      this.model.form = data
      this.model.form.name = data.label
      this.model.form.district = node.parent.data.id
      this.model.form.isValid = isValid
      const { id } = this.model.form

      await updateNodeApi(id, this.model.form)
      this.$store.dispatch('project/getApplyStatus', '')
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          this.pageLoading = true
          const { id } = this.model.form
          try {
            if (!id) {
              await addNodeApi(this.model.form)
            } else {
              await updateNodeApi(id, this.model.form)
            }
          } catch (errMsg) {
            this.$message.error(errMsg)
          }
          await this.$store.dispatch('project/getApplyStatus', '')

          this.pageLoading = false

          this.model.visible = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.form-card{
  width:600px;
  margin:60px auto;
}
.form-card__btn{
  text-align:center;
  margin:30px 0 10px
}
.custom-tree-node ::v-deep .el-button--text {
  font-size: 14px;
  color: #7f8489;

  &:nth-of-type(1) {
    margin: 0 10px;
  }
}

.node-tree {
  margin-top: 20px;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
