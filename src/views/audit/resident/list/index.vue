<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-28 15:17:52
 * @Description:申请列表
-->

<template>
  <div class="app-container">
    <el-button type="primary" size="medium" style="margin-bottom:20px" @click="addApply">新增申请</el-button>

    <el-table v-loading="listLoading" row-key="$index" style="width:100%" :data="list" :default-sort="{prop: 'applyTime', order: 'descending'}" border fit highlight-current-row @row-dblclick="flowView">
      <el-table-column align="center" label="序号" min-width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="编号" prop="code" min-width="200" align="center" />
      <el-table-column label="提交时间" min-width="200" align="center" prop="applyTime" sortable>
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核时间" min-width="200" align="center" prop="auditTime" sortable>
        <template v-if="scope.row.auditTime" slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.auditTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="110" align="center" prop="status" sortable>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | keyToVal(applyTag)">{{ scope.row.status | keyToVal(applyStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-row type="flex" justify="space-around">
            <el-button v-if="scope.row.status === 0" size="mini" type="primary" @click="$router.push({path:'/resident/apply',query:{applyId:scope.row.Id}})">提交材料</el-button>
            <el-button v-if="scope.row.status === 1" size="mini" type="success" @click="viewAudit">审核结果</el-button>

            <!-- <el-button v-if="scope.row.status === 1 && scope.row.dissent" size="mini" type="success" @click="dissentView"> 查看反馈</el-button> -->
            <el-button v-if="scope.row.status === 10" size="mini" type="danger" @click="viewAudit(scope.row)">审核意见</el-button>
            <el-tag v-if="scope.row.status === 2" size="medium" type="success">申请已通过</el-tag>
            <!-- <el-button v-if="scope.row.status !== 0" size="mini" type="primary" @click="flowView">查看流程</el-button> -->
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="撤销申请" min-width="80" align="center">
        <template slot-scope="scope">
          <el-popconfirm v-if="scope.row.status !== 10 && scope.row.status !== 2" title="确认撤销申请吗？" @onConfirm="cancelApply(scope.row)">
            <el-button slot="reference" size="mini" type="text">撤销</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <p>双击行 查看当前申请流程</p>
      <p>联系方式：</p>
      <p>审核单位：XXX街道办 审核人员：XXX 联系电话：0512XXXX 工作时间：周一至周五 9:00-11:00 14:00-17:00</p>
    </div>
    <!-- 新增申请 -->
    <el-dialog v-el-drag-dialog title="新增申请" center :visible.sync="model.visible" :close-on-click-modal="false" min-width="700px" @closed="resetForm">
      <el-form ref="form" v-loading="formLoading" :model="model.form" :rules="model.rules" label-width="120px">
        <el-form-item label="申请人" prop="name">
          <el-input v-model="model.form.name" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-cascader v-model="model.form.address" :options="addressOptions" />
          <label for="address-detail" class="label-detail"> — </label>
          <el-cascader v-model="plot" :options="plotOptions" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="model.form.phone" />
        </el-form-item>
        <el-form-item label="加装电梯地址" prop="elevatorAddress">
          <el-input v-model="model.form.elevatorAddress" placeholder="xxx小区xx幢xxx单元" />
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

      <span slot="footer">
        <el-button @click="model.visible = false">取 消</el-button>
        <el-button type="primary" @click="postApply">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 审核结果 -->
    <el-dialog v-el-drag-dialog title="审核结果" center :visible.sync="auditVisible" :close-on-click-modal="false" min-width="700px">
      <el-form ref="form" v-loading="formLoading" label-width="120px">
        <el-form-item label="审核人">
          {{ audit.name }}
        </el-form-item>
        <el-form-item label="单位">
          {{ audit.org }}
        </el-form-item>
        <el-form-item label="电话">
          {{ audit.phone }}
        </el-form-item>
        <el-form-item label="审核意见">
          {{ audit.remarks }}
        </el-form-item>
        <el-form-item label="附件">
          {{ audit.attachments }}
        </el-form-item>
        <el-form-item label="审核结果">
          {{ audit.result }}
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="auditVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 异议结果 -->
    <el-dialog v-el-drag-dialog title="异议处理结果" center :visible.sync="dissentVisible" :close-on-click-modal="false" min-width="800px">
      <el-collapse>
        <el-collapse-item v-for="(item, index) in dissents" :key="index">
          <template slot="title">
            建议人：{{ item.name }}
            <el-tag :type="item.status | keyToVal(handleTag)">{{ item.status | keyToVal(handleStatus) }}</el-tag>
          </template>
          <!-- <div>
          建议人：{{ item.name }}
          <el-tag :type="item.status | keyToVal(handleTag)">{{ item.status | keyToVal(handleStatus) }}</el-tag>
        </div> -->
          <p>时间：{{ item.time }}</p>
          <p>联系方式：{{ item.phone }}</p>
          <p>详细地址：{{ item.address }}</p>
          <div>
            <p>异议详情：</p>
            <el-input v-model="item.detail" type="textarea" />
          </div>
          <div v-if="item.status === 1">
            <p>异议反馈</p>
            <el-input v-model="item.feedback" type="textarea" />
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
    <!-- 查看流程 -->
    <el-dialog v-el-drag-dialog title="申请流程" center :visible.sync="flowVisible" :close-on-click-modal="false" min-width="1000px">
      <flow />
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { keyToVal, deepClone } from '@/utils'
import { validatePhone, validateTrueName } from '@/utils/element-validator'
import Flow from '@/components/street/Flow'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
const defaultForm = {
  name: '',
  address: [],
  phone: '',
  elevatorAddress: '',
  designer: '',
  device: '',
  rooms: [{ key: 'defaultRoom', val: '' }]
}
export default {
  filters: {
    keyToVal
  },
  components: {
    Flow
  },
  directives: { elDragDialog },
  data() {
    return {
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
          address: [{ required: true, message: '地址不为空', trigger: 'blur' }],
          phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
          elevatorAddress: [{ required: true, message: '电梯地址不为空', trigger: 'blur' }],
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
          status: 10 // 已驳回
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
      ]
    }
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag', 'handleStatus', 'handleTag']),
    ...mapGetters('common', ['addressOptions', 'plotOptions'])
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
      this.plot = ['canglang', 'shequ', 'xiaoqu']
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
    },
    postApply() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.plot.length === 0) {
            this.$message.error('请选择地址')
            return false
          }
          this.formLoading = true
          this.model.form.address = this.model.form.address.concat(this.plot)
          this.model.form.rooms = this.model.form.rooms.map(v => v.val)
          console.log(this.model.form)
          this.formLoading = false
          this.listLoading = true
          this.list.push({
            code: 'xxx小区' + Date.now,
            applyTime: new Date(),
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
</style>
