<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-11-02 11:01:59
 * @LastEditors: zfd
 * @Description: 增梯办管道踏勘
 * @FilePath: \jiayunti\src\components\street\Pipe\index.vue
-->
<template>
  <div class="app-container">
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <el-form label-width="120px" class="show-form">
          <el-form-item label="姓名">
            {{ basic.name }}
          </el-form-item>
          <el-form-item label="详细地址">
            <el-cascader v-model="basic.address" :options="addressOptions" />
            <label for="address-detail" class="label-detail"> — </label>
            <el-cascader v-model="plot" :options="plotOptions" />
          </el-form-item>
          <el-form-item label="电话">
            {{ basic.phone }}
          </el-form-item>
          <el-form-item label="加装电梯地址">
            {{ basic.liftAddress }}
          </el-form-item>
          <el-form-item label="设计单位">
            {{ basic.company }}
          </el-form-item>
          <el-form-item label="设备">
            {{ basic.spec }}
          </el-form-item>
        </el-form>

      </el-card>
    </div>

    <el-card style="margin-bottom:30px">
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>管道踏勘</span>
          <!-- <el-button v-if="editable" type="primary" style="float:right" @click="editable = !editable">提 交</el-button> -->
          <el-button v-if="editable" type="primary" style="float:right" @click="editable = !editable">保 存</el-button>
          <el-button v-else type="primary" style="float:right" @click="editable = !editable">修 改</el-button>
        </el-row>
      </div>
      <!-- 修改保存 -->
      <div v-if="editable">
        <el-table :data="model.tableData" border highlight-current-row style="width: 100%">
          <el-table-column label="序号" min-width="60" align="center">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="项目" min-width="180" prop="project" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.company" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="单位" min-width="240" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.company" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="是否完成" min-width="180" align="center">
            <template slot-scope="{row}">
              <el-checkbox v-model="row.isComplete">是</el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="时间" min-width="250" align="center">
            <template slot-scope="{row}">
              <el-date-picker v-model="row.time" type="datetime" size="small" :disabled="!row.isComplete" />
            </template>
          </el-table-column>
          <el-table-column label="结果" min-width="240" align="center">
            <template slot-scope="{row}">
              <el-input v-model="row.result" size="small" :disabled="!row.isComplete" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 查看 -->
      <el-table v-else :data="model.tableData" border highlight-current-row style="width: 100%">
        <el-table-column label="序号" min-width="60" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="项目" min-width="180" prop="project" align="center">
          <template slot-scope="{row}">
            {{ row.project }}
          </template>
        </el-table-column>
        <el-table-column label="单位" min-width="240" align="center">
          <template slot-scope="{row}">
            {{ row.company }}
            <!-- <el-input v-model="row.company" size="small" /> -->
          </template>
        </el-table-column>
        <el-table-column label="是否完成" min-width="180" align="center">
          <template slot-scope="{row}">
            {{ row.isComplete }}
            <!-- <el-checkbox v-model="row.isComplete">是</el-checkbox> -->
          </template>
        </el-table-column>
        <el-table-column label="时间" min-width="250" align="center">
          <template slot-scope="{row}">
            {{ row.time }}
            <!-- <el-date-picker v-model="row.time" type="datetime" size="small" :disabled="!row.isComplete" /> -->
          </template>
        </el-table-column>
        <el-table-column label="结果" min-width="240" align="center">
          <template slot-scope="{row}">
            {{ row.result }}
            <!-- <el-input v-model="row.result" size="small" :disabled="!row.isComplete" /> -->
          </template>
        </el-table-column>
      </el-table>

    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Resident',
  data() {
    return {
      plot: '',
      editable: false,
      basic: {
        name: '李先生',
        address: ['jiangsu', 'suzhou', 'gusu', 'canglang', 'shequ'],
        phone: '15988800323',
        liftAddress: '小区1楼',
        company: '苏州建研院',
        spec: '高端电梯'
      },
      isFinished: false,
      model: {
        title: '踏勘记录',
        visible: false,
        tableData: [
          {
            project: '线路',
            company: '',
            isComplete: false,
            time: '',
            result: ''
          },
          {
            project: '建筑',
            company: '',
            isComplete: false,
            time: '',
            result: ''
          },
          {
            project: '水管',
            company: '',
            isComplete: false,
            time: '',
            result: ''
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('common', ['addressOptions', 'plotOptions'])

  },
  created() {
    this.plot = this.basic.address.slice(3)

    this.basic.address = this.basic.address.slice(0, 3)
  },
  methods: {
    saveRecord() {
      const isFinished = this.model.tableData.filter(v => {
        return !v.isComplete
      })
      if (isFinished.length === 0) {
        this.isFinished = true
      } else {
        this.isFinished = false
        this.model.visible = false
      }
    },
    completed() {
      this.model.visible = false
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
