import { mapState, mapGetters } from 'vuex'
import { deepClone, notEmptyArray } from '@/utils'
import { validatePhone, validateTrueName } from '@/utils/element-validator'
import Flow from '@/components/street/Flow'
import {cancelApi,listApi,addApi} from '@/api/projects'
const defaultForm = {
  applicantName: '',
  location: [],
  phoneNumber: '',
  address: { county: [], community: [] }, //
  designId: '',
  typeAndDevice: [], // []
  rooms: [{ key: 'defaultRoom', val: '' }]
}
const data = {

  fileList: [{ name: '123213' }, { name: '456465' }, { name: '789798' }],
  formLoading: false,
  listLoading: false,
  openLoading: false,
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
  list: [],
  countyProps: {
    value: 'id',
    label: 'name',
    children: 'areas'
  },
  communityProps: {
    value: 'id',
    label: 'name',
    children: 'communities'
  },
  communityOptions:[]
}

export default {
  name: 'ResidentList',
  components: {
    Flow
  },
  data() {
    return data
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag', 'handleStatus', 'handleTag']),
    ...mapGetters('common', ['countyOptions', 'deviceOptions', 'designOptions'])
  },
  watch: {
  },
  created() {
    this.listApplies()
  },
  methods: {
    // 打开申请Modal
    openAdd() {
      // 重置表格
      this.openLoading = true
      const { address } = this.model.form
      this.model.form = deepClone(defaultForm)
      this.model.form.address = address // 修复el-cascader bug
      this.model.form.applicantName = this.$store.getters.username
      const addressAsync = this.$store.dispatch('common/getAddress')
      const deviceAsync = this.$store.dispatch('common/getDevice')
      const designAsync = this.$store.dispatch('common/getDesign')

      Promise.all([addressAsync, deviceAsync, designAsync]).then(() => {
        this.model.form.address.county = this.$store.getters['address']?.slice(0, 2)
        this.communityOptions = this.$store.getters['common/communityOptions'](this.model.form.address.county)

        this.model.form.address.community = this.$store.getters['address']?.slice(2)
        // this.model.form.address = this.$store.getters.addressPlain
        this.model.form.phoneNumber = this.$store.getters['phone'] ?? ''
        this.model.visible = true
      }).catch((err) => {
        console.log(err)
        this.$message.error('信息获取失败')
      }).finally(() => (this.openLoading = false))
    },
    // 撤销申请
    cancelApply(row) {
      const { id } = row
      cancelApi(id).then(() => {
        this.listApplies()
      }).catch(err => {
        console.log(err)
        this.$message.error('撤销失败')
      })
    },
    // 提交申请
    postApply() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { location, rooms, address } = this.model.form
          if (notEmptyArray(location) && location.length === 3) {
            this.model.form.location = location.map(v => v.replace(/[<>&"']/gi, ' ').trim()) // 防止xss攻击
          } else {
            this.$message.error('请填写加装电梯地址')
            return
          }
          if (notEmptyArray(rooms)) {
            this.model.form.rooms = Array.from(new Set(rooms.map(v => v.val.replace(/[<>&"']/gi, ' ').trim()))) // 过滤 + 去重
          } else {
            this.$message.error('请填写单位下业主房间编号')
            return
          }
          this.model.form.address = address.community.concat(address.county)
          this.formLoading = true
          addApi(this.model.form).then(res => {
            this.model.visible = false
            this.listApplies()
          }).catch(err => {
            console.log(err)
          })
            .finally(() => {
              this.formLoading = false
            })

        } else {
          this.$message.error('请补全信息')
        }
      })
    },
    // 获取申请列表
    async listApplies() {
      this.listLoading = true
      await listApi().then(res => {
        if (notEmptyArray(res.content)) {
          this.list = res.content
        }
      }).catch(err => {
        this.$message.error('数据获取失败')
        console.log(err)
      })
      this.listLoading = false
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
    resetFrom(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
