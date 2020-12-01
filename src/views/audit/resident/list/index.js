import { mapState, mapGetters } from 'vuex'
import { deepClone, checkType, checkEmptyArray } from '@/utils'
import { validatePhone, validateTrueName } from '@/utils/element-validator'
import Flow from '@/components/street/Flow'
import Project from '@/api/projects'
const defaultForm = {
  applicantName: '许王鹏',
  location: [],
  phoneNumber: '15988800323',
  address: { county: [], community: [] },
  designId: '',
  typeAndDevice: '',
  rooms: [{ key: 'defaultRoom', val: '' }]
}
const data = {
  // #region
  // elevatorAddress: {
  //   cell: null,
  //   building: null,
  //   unit: null,
  //   // 迭代器
  //   [Symbol.iterator]: function() {
  //     let index = 0
  //     const keys = Object.keys(this)
  //     const next = () => {
  //       return {
  //         value: this[keys[index]],
  //         done: keys.length === index++
  //       }
  //     }
  //     return {
  //       next
  //     }
  //   }
  // },
  // #endregion

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
  audit: {

  },
  model: {
    visible: false,
    form: deepClone(defaultForm),
    rules: {
      applicantName: [{ required: true, validator: validateTrueName, trigger: 'blur' }],
      address: [{ required: true, message: '请选择地址' }],
      phoneNumber: [{ required: true, validator: validatePhone, trigger: 'blur' }],
      location: [{ required: true, message: '请输入地址' }]
      // designId: [{ required: true, message: '请选择设计单位', trigger: 'blur' }],
      // deviceId: [{ required: true, message: '请选择设备', trigger: 'blur' }]
    }
  },
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
    // #region
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:53',
    //   auditTime: '',
    //   status: 0 // 申请中
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:52',
    //   auditTime: '',
    //   status: 1 // 社区受理
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:51',
    //   auditTime: '2020-10-12 10:56',
    //   status: 1 // 社区受理
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:50',
    //   auditTime: '2020-10-12 10:56',
    //   status: 2 // 方案设计
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:49',
    //   auditTime: '2020-10-12 10:56',
    //   status: 3 // 公示阶段
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:48',
    //   auditTime: '2020-10-12 10:56',
    //   status: 4 // 管道踏勘
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:47',
    //   auditTime: '2020-10-12 10:56',
    //   status: 5 // 施工图设计
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:46',
    //   auditTime: '2020-10-12 10:56',
    //   status: 6 // 施工图审核
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:45',
    //   auditTime: '2020-10-12 10:56',
    //   status: 7 // 施工报价
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:44',
    //   auditTime: '2020-10-12 10:56',
    //   status: 8 // 街道审核
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:43',
    //   auditTime: '2020-10-12 10:56',
    //   status: 9 // 联合审查
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:42',
    //   auditTime: '2020-10-12 10:56',
    //   status: 10 // 审核通过
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:41',
    //   auditTime: '2020-10-12 10:56',
    //   status: 11 // 施工中
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:40',
    //   auditTime: '2020-10-12 10:56',
    //   status: 12 // 竣工验收
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   auditTime: '2020-10-12 10:56',
    //   applyTime: '2020-10-12 10:30',

    //   status: 13 // 驳回
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   auditTime: '2020-10-12 10:56',
    //   applyTime: '2020-10-12 10:20',
    //   status: 14 // 已撤销
    // }
    // #endregion
  ],
  countyProps: {
    value: 'id',
    label: 'name',
    children: 'areas'
  },
  communityProps: {
    value: 'id',
    label: 'name',
    children: 'communities'
  }
}

export default {
  name: 'List',
  components: {
    Flow
  },
  data() {
    return data
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag', 'handleStatus', 'handleTag']),
    ...mapGetters('common', ['countyOptions', 'deviceOptions', 'designOptions']),
    communityOptions() {
      if (this.model.form.address.county.length) {
        return this.$store.getters['common/communityOptions'](this.model.form.address.county)
      }
      return []
    }
  },
  watch: {
    // elevatorAddress: {
    //   handler(newValue) {
    //     this.model.form.elevatorAddress = [...newValue]
    //   },
    //   deep: true,
    //   immediate: true
    // }
  },
  created() {
    this.listApplies()
  },
  methods: {
    // 打开申请Modal
    openAddModal() {
      // const address = this.$store.dispatch('common/getAddress')
      // const device = this.$store.dispatch('common/getDevice')
      // const design = this.$store.dispatch('common/getDesign')
      this.model.form.address.county = this.$store.getters['address']?.slice(0, 2)
      this.model.form.address.community = this.$store.getters['address']?.slice(2)
      this.model.form.phoneNumber = this.$store.getters['phone'] ?? ''
      this.model.visible = true
      // Promise.all([address, device, design]).then(res => {
      //   console.log(res)
      // }).catch(() => this.$message.error('信息获取失败'))
    },
    // 提交申请
    postApply() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { location, rooms, address } = this.model.form
          if (!checkEmptyArray(location) && location.length === 3) {
            this.model.form.location = location.map(v => v.replace(/[<>&"']/gi, ' ').trim()) // 防止xss攻击
          } else {
            this.$message.error('请填写加装电梯地址')
            return
          }
          if (!checkEmptyArray(rooms)) {
            this.model.form.rooms = Array.from(new Set(rooms.map(v => v.val.replace(/[<>&"']/gi, ' ').trim()))) // 过滤 + 去重
          } else {
            this.$message.error('请填写单位下业主房间编号')
            return
          }
          this.model.form.address = address.community.concat(address.county)
          this.formLoading = true
          console.log(this.model.form)
          debugger
          Project.add(this.model.form).then(res => {
            console.log(res)
            this.formLoading = false
            this.model.visible = false
          }).catch(err => {
            console.log(err)
            this.formLoading = false
          })
          // this.listLoading = true
          // this.list.push({
          //   code: `${this.model.form.elevatorAddress[0]}小区${this.model.form.elevatorAddress[0]}幢${this.model.form.elevatorAddress[0]}单元`,
          //   applyTime: new Date().getTime(),
          //   auditTime: '',
          //   status: 0
          // })

          // this.listLoading = false
        } else {
          this.$message.error('请补全信息')
        }
      })
    },
    // 获取申请列表
    async listApplies() {
      this.listLoading = true
      await Project.list().then(res => {
        if (!checkEmptyArray(res.content)) {
          this.list = res.content
        }
      }).catch(err => {
        this.$message.error('数据获取失败')
        console.log(err)
      })
      this.listLoading = false
    },
    dissentView() {
      this.dissentVisible = true
    },
    flowView(row, column, event) {
      if (row.status !== 0) {
        this.flowVisible = true
      }
    },

    handleRoom(index) {
      if (index === 0) {
        this.model.form.rooms.push({ key: Date.now(), val: '' })
      } else {
        this.model.form.rooms.splice(index, 1)
      }
    },
    // 重置表单
    resetForm() {
      this.model.form = deepClone(defaultForm)
      this.$refs.form.clearValidate()
    }

  }
}
