<!--
 * @Author: 张飞达
 * @Date: 2020-10-12 09:38:42
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-20 15:40:34
 * @Description:申请列表
-->

<template>
  <div class="app-container">
    <el-button type="primary" size="medium" style="margin-bottom:20px" @click="addApply">新增申请</el-button>

    <el-table v-loading="listLoading" style="width:100%" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="序号" min-width="50">
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
    <!-- 新增申请 -->
    <el-dialog title="新增申请" center="" :visible.sync="model.visible" :close-on-click-modal="false" width="600px" @closed="resetForm">
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
        <el-form-item
          v-for="(room, index) in dynamicRooms"
          :key="room.key"
          :label="'房间编号' + (index+1)"
          :prop="room.val"
          :rules="{required: true, message: '房间编号不能为空', trigger: 'blur'}"
        >
          <el-input v-model="room.val" placeholder="400">
            <template slot="append">
              <el-button
                :icon="index == 0 ? 'el-icon-plus' : 'el-icon-minus'"
                @click="handleRoom(index)"
              />
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="model.visible = false">取 消</el-button>
        <el-button type="primary" @click="postApply">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { keyToVal, deepClone } from '@/utils'
import { validatePhone, validateTrueName } from '@/utils/element-validator'

const defaultForm = {
  name: '',
  address: [],
  phone: '',
  elevatorAddress: '',
  rooms: []
}
export default {
  filters: {
    keyToVal
  },
  data() {
    return {
      formLoading: false,
      listLoading: false,
      model: {
        visible: false,
        form: deepClone(defaultForm),
        rules: {
          name: [{ required: true, validator: validateTrueName, trigger: 'blur' }],
          address: [{ required: true, message: '地址不为空', trigger: 'blur' }],
          phone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
          elevatorAddress: [{ required: true, message: '电梯地址不为空', trigger: 'blur' }]
        }
      },
      dynamicRooms: [{ key: Date.now(), val: '' }],
      plot: [],
      addressOptions: [{
        value: 'jiangsu',
        label: '江苏',
        children: [
          {
            value: 'suzhou',
            label: '苏州',
            children: [
              {
                value: 'gusu',
                label: '姑苏区',
                children: null
              },
              {
                value: 'gyyq',
                label: '工业园区'
              }
            ]
          },
          {
            value: 'wuxi',
            label: '无锡'
          }
        ]
      }, {
        value: 'zhejiang',
        label: '浙江',
        children: [
          {
            value: 'hangzhou',
            label: '杭州'
          },
          {
            value: 'ningbo',
            label: '宁波'
          }
        ]
      }
      ],
      plotOptions: [{
        value: 'canglang',
        label: '沧浪街道',
        children: [
          {
            value: 'shequ',
            label: '社区',
            children: [
              {
                value: 'xiaoqu',
                label: '小区'
              }
            ]
          },
          {
            value: 'shequ1',
            label: '社区1'
          }
        ]
      }
      ],
      list: [
        {
          code: '小区--222幢--几',
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
      ]
    }
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag'])
  },
  created() {
  },
  methods: {
    addApply() {
      this.model.form.name = '张飞达'
      this.model.form.address = ['jiangsu', 'suzhou', 'gusu']
      this.plot = ['canglang', 'shequ', 'xiaoqu']
      this.model.form.phone = '15988800323'
      this.model.visible = true
    },
    handleRoom(index) {
      if (index === 0) {
        this.dynamicRooms.push({ key: Date.now(), val: '' })
      } else {
        this.dynamicRooms.splice(index, 1)
      }
    },
    resetForm() {
      this.model.form = deepClone(defaultForm)
      this.dynamicRooms = [{ key: Date.now(), val: '' }]
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
          this.model.form.rooms = this.dynamicRooms.map(v => v.val)
          this.formLoading = false
          console.log(this.model.form)
          this.model.visible = false
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
