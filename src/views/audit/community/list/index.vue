<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-23 13:28:14
 * @Description:申请列表
-->

<template>
  <div class="app-container">
    <el-table v-loading="listLoading" style="width:100%" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="序号" min-width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="code" min-width="200" align="center" />
      <el-table-column label="提交时间" min-width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" min-width="200" align="center">
        <template v-if="scope.row.auditTime" slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.auditTime }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" min-width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | keyToVal(applyTag)">{{ scope.row.status | keyToVal(applyStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="140">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around">
            <el-button v-if="scope.row.status === 1" size="mini" type="info" @click="$router.push({path:'/community/record',query:{applyId:scope.row.Id}})">异议记录</el-button>
            <el-button v-if="scope.row.status === 0" size="mini" type="warning" @click="$router.push({path:'/community/check',query:{applyId:scope.row.Id}})">审核</el-button>
            <el-button v-if="scope.row.status === 3" size="mini" type="warning" @click="model.visible = true">踏勘记录</el-button>
            <el-button size="mini" type="primary" @click="flowView">查看流程</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <p>联系方式</p>
      <p>审核单位：XXX街道办 审核人员：XXX 联系电话：0512XXXX 工作时间：周一至周五 9:00-11:00 14:00-17:00</p>
    </div>
    <!-- 管道踏勘 -->
    <!-- <el-dialog :title="model.title" :visible.sync="model.visible" :close-on-click-modal="false" center width="50%">
      <el-table :data="model.tableData" border highlight-current-row style="width: 100%">
        <el-table-column label="序号" min-width="60" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="项目" min-width="180" prop="project" align="center" />
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

    </el-dialog> -->

    <!-- 查看流程 -->
    <el-dialog v-el-drag-dialog title="流程图" center :visible.sync="flowVisible" :close-on-click-modal="false" min-width="1000px">
      <flow />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { keyToVal } from '@/utils'
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
      list: [
        {
          code: 'apply10121056',
          applyTime: '2020-10-12 10:56',
          auditTime: '2020-10-14 10:56',
          status: 1, // 公示阶段
          dissent: false // 暂无异议
        },
        {
          code: 'apply10131146',
          applyTime: '2020-10-13 11:46',
          auditTime: '2020-10-14 10:56',
          status: 1, // 公示阶段
          dissent: true // 暂无异议
        },
        {
          code: 'apply10140800',
          applyTime: '2020-10-14 08:00',
          auditTime: '2020-10-14 10:56',
          status: -1 // 已驳回
        },
        {
          code: 'apply10140900',
          applyTime: '2020-10-14 09:00',
          auditTime: '2020-10-14 10:56',
          status: 2 // 审核通过
        },
        {
          code: 'apply10150900',
          applyTime: '2020-10-15 09:00',
          auditTime: '',
          status: 0 // 正在审核中
        },
        {
          code: 'apply10190900',
          applyTime: '2020-10-19 09:00',
          auditTime: '2020-10-20 09:00',
          status: 3 // 正在审核中
        }
      ],
      listLoading: false,
      isFinished: false,
      flowVisible: false,
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
    ...mapState('common', ['applyStatus', 'applyTag'])
  },
  created() {
  },
  methods: {
    flowView() {
      this.flowVisible = true
    },
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
</style>
