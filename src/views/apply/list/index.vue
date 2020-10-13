<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: 张飞达
 * @LastEditTime: 2020-10-12 15:11:30
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
      <el-table-column label="提交日期" min-width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核日期" min-width="200" align="center">
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
      <el-table-column align="center" label="操作" min-width="200">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around">
            <el-popconfirm v-if="scope.row.status !== -1 && scope.row.status !== 2" title="确认撤销申请吗？" @onConfirm="cancelApply(scope.row)">
              <el-button slot="reference" size="mini" type="info">撤销申请</el-button>
            </el-popconfirm>
            <el-button v-if="scope.row.status === 1 && scope.row.dissent" size="mini" type="success" @click="dissentResult(scope.row)">
              <router-link :to="{path:'/collapse/index',query:{applyId:scope.row.Id}}">查看反馈</router-link>
            </el-button>
            <el-button v-if="scope.row.status === -1" size="mini" type="danger" @click="viewAudit(scope.row)">审核意见</el-button>
            <el-tag v-if="scope.row.status === 2" size="medium" type="success">申请已通过</el-tag>
            <el-button size="mini" type="primary" @click="viewProcess(scope.row)">查看流程</el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <p>联系方式</p>
      <p>审核单位：XXX街道办 审核人员：XXX 联系电话：0512XXXX 工作时间：周一至周五 9:00-11:00 14:00-17:00</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { keyToVal } from '@/utils'
export default {
  filters: {
    keyToVal
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
        }
      ],
      listLoading: false
    }
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag'])
  },
  created() {
  },
  methods: {
  }
}
</script>
<style scoped>

</style>
