import { mapState, mapGetters } from 'vuex'
import { keyToVal, deepClone, parseTime, numberFormat } from '@/utils'
import { validatePhone, validateTrueName } from '@/utils/element-validator'
import Flow from '@/components/street/Flow'
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui
const defaultForm = {
  applicantName: '',
  location: [],
  phoneNumber: '',
  address: [],
  designId: '',
  deviceId: '',
  rooms: [{ key: 'defaultRoom', val: '' }]
}
const data = {
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
export default {
  name: 'List',
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
    return data
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag', 'handleStatus', 'handleTag']),
    ...mapGetters('common', ['countyOptions', 'deviceOptions', 'deviceOptions'])
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
