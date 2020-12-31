import { mapState, mapGetters } from 'vuex'
import { deepClone, notEmptyArray } from '@/utils'
import { validatePhone, validateTrueName } from '@/utils/element-validator'
// import Flow from '@/components/street/Flow'
import { cancelApi, listApi, addApi } from '@/api/projects'
const defaultForm = {
  applicantName: '',
  location: [],
  phoneNumber: '',
  address: { county: [], community: [] }, //
  designId: '',
  typeAndDevice: [], // []
  rooms: [{ key: 'defaultRoom', val: '' }]
}

export default {
  name: 'ResidentList',
  // components: {
  //   Flow
  // },
  data() {
    return {

      formLoading: false,
      listLoading: false,
      openLoading: false,
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
          location: [{ required: true, message: '请输入地址' }],
          designId: [{ required: true, message: '请选择设计单位', trigger: 'blur' }],
          typeAndDevice: [{ required: true, message: '请选择设备', trigger: 'blur' }]
        }
      },
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
      expandLoading: false,
      communityOptions: []
    }
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
    async handleExpand(row, expandedRows) {
      if (Object.keys(row.apply).length === 0) {
        this.expandLoading = true
        const apply = await this.$store.dispatch('getProjectBasic', row.id)
        const idx = this.list.findIndex(v => v.id === row.id)
        this.$set(this.list[idx], 'apply', apply)
        this.expandLoading = false
      }
    },
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
      }).catch(() => {
        this.$message.error('信息获取失败')
      }).finally(() => (this.openLoading = false))
    },
    // 撤销申请
    cancelApply(row) {
      const { id } = row
      cancelApi(id).then(() => {
        this.listApplies()
      }).catch(() => {
        this.$message.error('撤销失败')
      })
    },
    // 提交申请
    postApply() {
      this.$refs.form.validate((valid, errors) => {
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
          }).catch(() => {
            this.$message.error('新增申请失败')
          })
            .finally(() => {
              this.formLoading = false
            })
        } else {
          this.$message.error(Object.values(errors)[0][0].message)
        }
      })
    },
    // 获取申请列表
    async listApplies() {
      this.listLoading = true
      await listApi({}, {}).then(res => {
        this.list = []
        if (notEmptyArray(res.content)) {
          // this.list = res.content
          if (notEmptyArray(res.content)) {
            res.content.forEach(v => {
              v.apply = {}
              this.list.push(v)
            })
          }
        }
      }).catch(() => {
        this.$message.error('数据获取失败')
      })
      this.listLoading = false
    },
    // flowView(row, column, event) {
    //   if (row.status !== 0) {
    //     this.flowVisible = true
    //   }
    // },

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
