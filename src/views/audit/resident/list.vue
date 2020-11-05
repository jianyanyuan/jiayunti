<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-03 15:48:56
 * @Description:申请列表
-->

<template>
  <div class="app-container">
    <el-button type="primary" size="medium" style="margin-bottom:20px" @click="addApply">新增申请</el-button>

    <el-card>
      <el-table v-loading="listLoading" row-key="$index" style="width:100%" :data="list" :default-sort="{prop: 'applyTime', order: 'descending'}" fit highlight-current-row @row-dblclick="flowView">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="code" align="center" />
        <el-table-column label="提交时间" align="center" prop="applyTime" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.applyTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" align="center" prop="auditTime" sortable>
          <template v-if="scope.row.auditTime" slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.auditTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" sortable>
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | keyToVal(applyTag)">{{ scope.row.status | keyToVal(applyStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-row type="flex" justify="space-around">
              <el-button v-if="scope.row.status === 0" size="mini" type="warning" plain @click="$router.push({path:'/resident/apply',query:{applyId:scope.row.Id}})">提交材料</el-button>
              <el-tag v-if="scope.row.status === 1 && !scope.row.auditTime" size="medium" type="warning" effect="light">社区受理中</el-tag>

              <el-button v-if="scope.row.status === 3" size="mini" type="primary" plain @click="$router.push({name:'ResidentApplyNotice',params:{applyId:scope.row.Id}})">提交材料</el-button>

              <el-button v-if="scope.row.status === 3" size="mini" type="warning" plain @click="$router.push({name:'ResidentAssentsDetail',params:{}})">异议反馈</el-button>

              <el-tag v-if="scope.row.status === 4" size="medium" type="warning" effect="light">管道踏勘中</el-tag>

              <el-button v-if="scope.row.status === 2 || scope.row.status === 5" size="mini" type="success" plain @click="$router.push({name:'ResidentDesignDetail',params:{}})">查看设计</el-button>
              <el-button v-if="scope.row.status === 7" size="mini" type="warning" plain @click="$router.push({name:'ResidentOffer',params:{}})">选择报价</el-button>
              <el-tag v-if="scope.row.status === 10" size="medium" type="success" effect="light">申请已通过</el-tag>
              <el-tag v-if="scope.row.status === 13" size="medium" type="danger" effect="light">已驳回</el-tag>
              <el-tag v-if="scope.row.status === 14" size="medium" type="danger" effect="light">已撤销</el-tag>
              <el-button v-if="scope.row.status === 11" size="mini" type="warning" plain @click="$router.push({name:'ResidentFaultView',params:{}})">违规查看</el-button>
              <!-- <el-button v-if="scope.row.status === 12" size="mini" type="warning" plain @click="$router.push({path:'/construction/complete',query:{applyId:row.Id}})">竣工验收</el-button> -->
              <el-button v-if="scope.row.status === 12" size="mini" type="warning" @click="subsidyVisible = true">补贴查看</el-button>
              <el-tag v-if="[1,6,8,9].includes(scope.row.status) && scope.row.auditTime" size="medium" type="success">审核已通过</el-tag>

              <el-button v-if="[0,5].includes(scope.row.status) && scope.row.auditTime" size="mini" plain type="warning" @click="$router.push({name:'ResidentAuditDetail',params:{}})">审核结果</el-button>

              <!-- <el-button v-if="scope.row.status === 1 && scope.row.dissent" size="mini" type="success" @click="dissentView"> 查看反馈</el-button> -->
              <!-- <el-button v-if="scope.row.status === 10" size="mini" type="danger" @click="viewAudit(scope.row)">审核意见</el-button> -->
              <!-- <el-button v-if="scope.row.status !== 0" size="mini" type="primary" @click="flowView">查看流程</el-button> -->
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="撤销申请" align="center">
          <template slot-scope="scope">
            <el-popconfirm v-if="scope.row.status !== 11 && scope.row.status !== 12" title="确认撤销申请吗？" @onConfirm="cancelApply(scope.row)">
              <el-button slot="reference" size="mini" type="text" style="letter-spacing:1em">撤销</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <p class="contract-tip">审核单位：<span>XXX街道办</span> 审核人员：<span>XXX</span> 联系电话：<span>0512XXXX</span> 工作时间：周一至周五 9:00-11:00 14:00-17:00</p>

    <!-- 新增申请 -->
    <el-dialog v-el-drag-dialog title="新增申请" :visible.sync="model.visible" :close-on-click-modal="false" width="600px" top="10vh" @closed="resetForm">
      <el-form ref="form" v-loading="formLoading" :model="model.form" :rules="model.rules" label-width="120px">
        <el-form-item label="申请人" prop="name">
          <el-input v-model="model.form.name" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-row>
            <el-col :span="12">
              <el-cascader v-model="model.form.address" :options="addressOptions" style="display:block" />
            </el-col>
            <el-col :span="2" style="text-align:center"><label for="address-detail" class="label-detail"> — </label></el-col>
            <el-col :span="10">
              <el-cascader v-model="plot" :options="plotOptions" style="display:block" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="model.form.phone" />
        </el-form-item>
        <el-form-item label="加装电梯地址" prop="elevatorAddress">
          <div> <input v-model="elevatorAddress.cell" type="text" name="cell" autocomplete="false"> 小区</div>
          <div> <input v-model="elevatorAddress.building" type="text" name="building" autocomplete="false"> 幢</div>
          <div> <input v-model="elevatorAddress.unit" type="text" name="unit" autocomplete="false"> 单元</div>
        </el-form-item>
        <el-form-item label="设计单位" prop="designer">
          <el-select v-model="model.form.designer">
            <el-option v-for="item in designerOptions" :key="item.val" :label="item.val" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备" prop="device">
          <el-cascader v-model="model.form.device" :options="deviceOptions">
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="node.isLeaf">kg</span>
            </template>
          </el-cascader>
        </el-form-item>
        <!-- 单元下业主 -->
        <el-form-item v-for="(room, index) in model.form.rooms" :key="room.key" :label="'房间编号' + (index+1)" :prop="'rooms.' + index + '.val'" :rules="{required: true, message: '房间编号不能为空', trigger: 'blur'}">
          <el-input v-model="room.val" placeholder="400">
            <template slot="append">
              <el-button :icon="index == 0 ? 'el-icon-plus' : 'el-icon-minus'" @click="handleRoom(index)" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div style="text-align:center">
        <el-button @click="model.visible = false">取 消</el-button>
        <el-button type="primary" @click="postApply">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 补贴查看 -->
    <el-dialog v-el-drag-dialog title="补贴查看" center :visible.sync="subsidyVisible" :close-on-click-modal="false" class="uploadModal">
      <el-form :model="subsidy" label-position="top">
        <el-form-item label="补助金额（元）:">
          {{ subsidy.money | numberFormat }}
        </el-form-item>
        <el-form-item label="证明材料:" prop="attachment">
          <a v-for="file in fileList" :key="file.name" class="file-display">
            <i class="el-icon-document" />
            {{ file.name }}
            <i class="el-icon-download" style="float:right" />
          </a>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 查看流程 -->
    <el-dialog v-el-drag-dialog title="申请流程" center :visible.sync="flowVisible" :close-on-click-modal="false" min-width="1000px">
      <flow />
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { keyToVal, deepClone, parseTime, numberFormat } from '@/utils'
import { validatePhone, validateTrueName } from '@/utils/element-validator'
import Flow from '@/components/street/Flow'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
const defaultForm = {
  name: '',
  address: [],
  phone: '',
  elevatorAddress: [],
  designer: '',
  device: '',
  rooms: [{ key: 'defaultRoom', val: '' }]
}
export default {
  filters: {
    keyToVal,
    parseTime,
    numberFormat
  },
  components: {
    Flow
  },
  directives: { elDragDialog },
  data() {
    return {
      elevatorAddress: {
        cell: null,
        building: null,
        unit: null,
        // 迭代器
        [Symbol.iterator]: function() {
          let index = 0
          const keys = Object.keys(this)
          const next = () => {
            return {
              value: this[keys[index]],
              done: keys.length === index++
            }
          }
          return {
            next
          }
        }
      },
      fileList: [{ name: '123213' }, { name: '456465' }, { name: '789798' }],
      subsidy: {
        money: '79746464'
      },
      subsidyVisible: false,
      formLoading: false,
      listLoading: false,
      auditVisible: false,
      dissentVisible: false,
      flowVisible: false,
      designerOptions: [
        { key: 1, val: '建研院' },
        { key: 2, val: '设计' }
      ],
      audit: {

      },
      deviceOptions: [
        {
          label: '设备1',
          value: '1',
          children: [
            {
              label: '600',
              value: '11'
            },
            {
              label: '500',
              value: '12'
            }
          ]
        },
        {
          label: '设备2',
          value: '2',
          children: [
            {
              label: '600',
              value: '22'
            }
          ]
        }
      ],
      model: {
        visible: false,
        form: deepClone(defaultForm),
        rules: {
          name: [{ required: true, validator: validateTrueName, trigger: 'blur' }],
          address: [{ required: true }],
          phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
          elevatorAddress: [{ required: true }],
          designer: [{ required: true, message: '设计单位不为空', trigger: 'blur' }],
          device: [{ required: true, message: '设备不为空', trigger: 'blur' }]
        }
      },
      plot: [],
      dissents: [
        {
          name: '李先生',
          time: '2020-10-12 09:00',
          phone: '15988800123',
          address: '苏州高新区',
          detail: '设计方案不合理',
          status: 0
        },
        {
          name: '张先生',
          time: '2020-10-13 08:00',
          phone: '15988800456',
          address: '苏州高新区',
          detail: '设计方案不合理',
          feedback: '你的需求已知晓，将之后联系',
          status: 1
        }
      ],
      list: [
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:53',
          auditTime: '',
          status: 0 // 申请中
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:52',
          auditTime: '',
          status: 1 // 社区受理
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:51',
          auditTime: '2020-10-12 10:56',
          status: 1 // 社区受理
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:50',
          auditTime: '2020-10-12 10:56',
          status: 2 // 方案设计
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:49',
          auditTime: '2020-10-12 10:56',
          status: 3 // 公示阶段
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:48',
          auditTime: '2020-10-12 10:56',
          status: 4 // 管道踏勘
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:47',
          auditTime: '2020-10-12 10:56',
          status: 5 // 施工图设计
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:46',
          auditTime: '2020-10-12 10:56',
          status: 6 // 施工图审核
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:45',
          auditTime: '2020-10-12 10:56',
          status: 7 // 施工报价
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:44',
          auditTime: '2020-10-12 10:56',
          status: 8 // 街道审核
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:43',
          auditTime: '2020-10-12 10:56',
          status: 9 // 联合审查
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:42',
          auditTime: '2020-10-12 10:56',
          status: 10 // 审核通过
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:41',
          auditTime: '2020-10-12 10:56',
          status: 11 // 施工中
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:40',
          auditTime: '2020-10-12 10:56',
          status: 12 // 竣工验收
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          auditTime: '2020-10-12 10:56',
          applyTime: '2020-10-12 10:30',

          status: 13 // 驳回
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          auditTime: '2020-10-12 10:56',
          applyTime: '2020-10-12 10:20',
          status: 14 // 已撤销
        }
      ]
    }
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag', 'handleStatus', 'handleTag']),
    ...mapGetters('common', ['addressOptions', 'plotOptions'])
  },
  watch: {
    elevatorAddress: {
      handler(newValue) {
        this.model.form.elevatorAddress = [...newValue]
      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  methods: {
    dissentView() {
      this.dissentVisible = true
    },
    flowView(row, column, event) {
      if (row.status !== 0) {
        this.flowVisible = true
      }
    },
    addApply() {
      this.model.form.name = '张飞达'
      this.model.form.address = ['jiangsu', 'suzhou', 'gusu']
      this.plot = ['canglang', 'shequ']
      this.model.form.phone = '15988800323'
      this.model.visible = true
    },
    handleRoom(index) {
      if (index === 0) {
        this.model.form.rooms.push({ key: Date.now(), val: '' })
      } else {
        this.model.form.rooms.splice(index, 1)
      }
    },
    resetForm() {
      this.model.form = deepClone(defaultForm)
      this.plot = []
    },
    // 新增申请
    postApply() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.plot.length || !this.model.form.address.length) {
            this.$message.error('请选择地址')
            return false
          }
          if (this.model.form.elevatorAddress.includes(null)) {
            this.$message.error('请填写加装电梯地址')
            return false
          }
          this.formLoading = true
          this.model.form.address = this.model.form.address.concat(this.plot)
          this.model.form.rooms = this.model.form.rooms.map(v => v.val)
          console.log(this.model.form)
          this.formLoading = false
          this.listLoading = true
          this.list.push({
            code: `${this.model.form.elevatorAddress[0]}小区${this.model.form.elevatorAddress[0]}幢${this.model.form.elevatorAddress[0]}单元`,
            applyTime: new Date().getTime(),
            auditTime: '',
            status: 0
          })
          this.model.visible = false
          this.listLoading = false
        } else {
          this.$message.error('请补全信息')
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.dialog-container {
  min-width: 700px;
}
input {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 25px;
  padding: 0 15px;
}
input:focus {
  outline: none;
}
.contract-tip {
  padding: 0 10px;
  color: #686d76;
  line-height: 30px;
  span {
    margin-right: 20px;
  }
}
.file-display {
  display: block;
  text-align: left;
  padding: 5px;
  margin: 10px;
  border-radius: 5px;
  // background-color: chartreuse;
}
.file-display:hover {
  color: #409eff;
  background-color: #ebebeb;
}
</style>
