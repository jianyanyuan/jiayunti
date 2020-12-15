<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-12-15 09:57:35
 * @LastEditors: zfd
 * @Description: 增梯办管道踏勘
 * @FilePath: \jiayunti\src\components\street\Pipe\index.vue
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <el-form label-width="120px" class="show-form">
          <el-form-item label="申请人">
            {{ basic.applicantName }}
          </el-form-item>
          <el-form-item label="申请时间">
            {{ basic.createTime }}
          </el-form-item>
          <el-form-item label="用户地址">
            {{ basic.address }}
          </el-form-item>
          <el-form-item label="电话">
            {{ basic.phoneNumber }}
          </el-form-item>
          <el-form-item label="加装电梯地址">
            {{ basic.location }}
          </el-form-item>
          <el-form-item label="设计单位">
            {{ basic.designName }}
          </el-form-item>
          <el-form-item label="设备">
            {{ basic.device }}
          </el-form-item>
        </el-form>

      </el-card>
    </div>

    <el-card style="margin-bottom:30px">
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>管道踏勘</span>
          <!-- <el-button v-if="editable" type="primary" style="float:right" @click="editable = !editable">提 交</el-button> -->
          <el-button v-if="editable" type="primary" style="float:right" @click="handlePost">保 存</el-button>
          <el-button v-else type="primary" style="float:right" @click="editable = !editable">修 改</el-button>
        </el-row>
      </div>
      <!-- 修改保存 -->
      <div v-if="editable">
        <el-table :data="tableData" border highlight-current-row style="width: 100%">
          <el-table-column label="序号" min-width="60" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="项目" min-width="180" align="center">
            <template slot-scope="{row}">
              {{ row.type }}
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="240" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.unit" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="是否完成" min-width="180" prop="whetherComplete" align="center">
            <template slot-scope="{row}">
              <el-checkbox v-model="row.whetherComplete" @change="handleChange(row)">是</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="时间" min-width="250" align="center">
            <template slot-scope="{row}">
              <el-date-picker v-model="row.completeTime" type="datetime" size="small" :disabled="!row.whetherComplete" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
            </template>
          </el-table-column>
          <el-table-column label="结果" min-width="240" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.note" size="small" :disabled="!row.whetherComplete" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 查看 -->
      <el-table v-else :data="tableData" border highlight-current-row style="width: 100%">
        <el-table-column label="序号" min-width="60" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="项目" min-width="180" align="center">
          <template slot-scope="{row}">
            {{ row.type }}
          </template>
        </el-table-column>
        <el-table-column label="单位" min-width="240" align="center">
          <template slot-scope="{row}">
            {{ row.unit }}
            <!-- <el-input v-model="row.company" size="small" /> -->
          </template>
        </el-table-column>
        <el-table-column label="是否完成" min-width="180" align="center">
          <template slot-scope="{row}">
            {{ row.whetherComplete ? '是' : '否'}}
            <!-- <el-checkbox v-model="row.isComplete">是</el-checkbox> -->
          </template>
        </el-table-column>
        <el-table-column label="时间" min-width="250" align="center">
          <template slot-scope="{row}">
            <span v-if="row.completeTime && row.whetherComplete && !editable">{{ new Date(row.completeTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结果" min-width="240" align="center">
          <template slot-scope="{row}">
            {{ row.note }}
          </template>
        </el-table-column>
      </el-table>

    </el-card>
  </div>
</template>

<script>
import IncreaseLift from '@/api/increase_lift'
import Project from '@/api/projects'
import { notEmptyArray } from '@/utils'

export default {
  name: 'Pipe',
  data() {
    return {
      editable: false,
      basic: {},
      pageLoading: false,
      tableData: [],
      projectId: null,
      status: null,
      updateList: []
    }
  },
  computed: {
  },
  created() {
    const { id, status } = this.$route.params
    // 2方案设计
    if (!isNaN(+id) && status == 5) {
      this.projectId = id
      this.status = status
      this.detailApply()
    }
  },
  methods: {
    detailApply() {
      this.pageLoading = true
      const basicAsync = new Promise((resolve, reject) => {
        this.$store.dispatch('getProjectBasic', this.projectId)
          .then(res => {
            this.basic = res
            resolve('获取成功')
          })
          .catch(() => {
            reject('基础信息获取失败')
          })
      })
      const detailAsync = new Promise((resolve, reject) => {
        IncreaseLift.listPipe(this.projectId)
          .then(res => {
            if (notEmptyArray(res.content)) {
              this.tableData = res.content
            }
            resolve('ok')
          })
          .catch((err) => {
            reject(err)
          })
      })
      Promise.all([basicAsync, detailAsync]).then(() => {
        this.pageLoading = false
      }).catch((err) => {
        console.log(err)
        this.pageLoading = false
        this.$message.error('信息获取失败')
      })

    },
    handleChange(row) {
      if (!this.updateList.includes(row)) {
        // 引用传递
        this.updateList.push(row)
      }
    },
    handlePost() {
      this.pageLoading = true
      IncreaseLift.modifyPipe(this.updateList).then(async res => {
        const next = this.isFinished()
        if (next) {
          await Project.advance(this.projectId, this.status)
            .then(() => (this.$router.push('/increase-lift/list')))
            .catch(() => (this.$message.error('流程错误')))
          this.pageLoading = false
        } else {
          this.pageLoading = false
          this.detailApply()
        }

      }).catch(res => {
        this.pageLoading = false
        this.$message.error('保存失败')
      })
      this.editable = false
    },
    isFinished() {
      const idx = this.tableData.findIndex(v => !v.whetherComplete)
      if (idx !== -1) {
        return false 
      } else {
        return true // 全部完成
      }
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 2方案设计
    if (isNaN(+id) || status != 5) {
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  }
}
</script>

<style scoped lang="scss">
.show-form ::v-deep {
  .el-cascader,
  .el-input__suffix-inner {
    pointer-events: none;
    cursor: default;
    opacity: 0.8;
  }
}
.basic-container ::v-deep .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}
.expand-info .demo-table-expand ::v-deep label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 150px;
  margin-bottom: 0;
  width: 100%;
}
</style>
