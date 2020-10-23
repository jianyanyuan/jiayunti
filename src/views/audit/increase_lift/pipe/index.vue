<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-10-23 13:57:13
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
        <div>
          <p>姓名：{{ basic.name }}</p>
          <p>详细地址：{{ basic.address }}</p>
          <p>电话：{{ basic.phone }}</p>
          <p>加装电梯地址：{{ basic.liftAddress }}</p>
          <p>设计单位：{{ basic.company }}</p>
          <p>设备规格：{{ basic.spec }}</p>
        </div>
      </el-card>
    </div>

    <el-card style="margin-bottom:30px">
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>管道踏勘</span>
          <el-button v-if="editable" type="primary" style="float:right" @click="editable = true">修改</el-button>
          <el-button v-else type="primary" style="float:right" @click="editable = false">保存</el-button>
        </el-row>
      </div>
      <!-- 修改保存 -->
      <template v-if="editable">
        <el-table v-if="editable" :data="model.tableData" border highlight-current-row style="width: 100%">
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
        <span slot="footer">
          <el-button v-if="!isFinished" type="primary" @click="saveRecord">保 存</el-button>
          <el-button v-if="isFinished" type="primary" @click="completed">完 成</el-button>
        </span>
      </template>
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
export default {
  name: 'Resident',
  data() {
    return {
      editable: false,
      basic: {
        name: '李先生',
        address: '苏州高新区',
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

<style scoped>
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
