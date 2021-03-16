import { mapState, mapGetters } from 'vuex'
import { deepClone, notEmptyArray } from '@/utils'

import { validatePhone, validateTrueName } from '@/utils/element-validator'
import CreateButtons from '@/mixin/createButtons'
import { cancelApi, listApi, addApi } from '@/api/projects'
const defaultForm = {
  applicantName: '',
  applyMode: 'self',
  location: [],
  phoneNumber: '',
  address: { county: [], community: [] }, //
  designId: null,
  typeAndDevice: null, // []
  constructionId: null,
  supervisionId: null,
  principalId: null,
  rooms: [{ key: 'defaultRoom', val: '' }]
}

export default {
  name: 'ResidentList',

  mixins: [CreateButtons],
  data() {
    return {

      formLoading: false,
      listLoading: false,
      openLoading: false,
      flowVisible: false,
      audit: {},
      model: {
        visible: false,
        form: deepClone(defaultForm),
        rules: {
          applicantName: [{ required: true, validator: validateTrueName, trigger: 'blur' }],
          address: [{ required: true, message: '请选择地址' }],
          phoneNumber: [{ required: true, validator: validatePhone, trigger: 'blur' }],
          location: [{ required: true, message: '请输入地址' }]
        }
      },
      list: [],

      // expandLoading: false,
      communityOptions: []

    }
  },
  computed: {
    ...mapState('project', ['applyTag']),
    ...mapGetters('project', ['validApplyStatus']),
    ...mapGetters('common', ['countyOptions', 'deviceOptions', 'designOptions', 'supervisionOptions', 'constructionOptions', 'trusteeOptions'])
  },
  created() {
    this.listApplies()
  },
  methods: {
    async handleExpand(row) {
      if (Object.keys(row.apply).length === 0) {
        // this.expandLoading = true
        const apply = await this.$store.dispatch('getProjectBasic', row.id)
        const idx = this.list.findIndex(v => v.id === row.id)
        this.$set(this.list[idx], 'apply', apply)
        // this.expandLoading = false
      }
    },
    // 打开申请Modal
    openAdd() {
      // 重置表格
      this.openLoading = true
      // const { address } = this.model.form
      this.model.form = deepClone(defaultForm)
      this.model.form.address = this.$store.getters['addressPlain']
      // this.model.form.address = address // 修复el-cascader bug
      this.model.form.applicantName = this.$store.getters.username
      // this.model.form.address.county = this.$store.getters['address']?.slice(0, 2)
      // this.communityOptions = this.$store.getters['common/communityOptions'](this.model.form.address.county)
      this.model.form.applyMode = 'self'
      // this.model.form.address.community = this.$store.getters['address']?.slice(2)
      this.model.form.phoneNumber = this.$store.getters['phone'] ?? ''
      this.model.visible = true
      this.openLoading = false
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { location, rooms } = this.model.form
          if (notEmptyArray(location) && location.length === 3) {
            this.model.form.location = location.map(v => v.trim()) // 防止xss攻击
          } else {
            this.$message.warning('请填写加装电梯地址')
            return
          }

          if (this.model.form.applyMode === 'self') {
            const { designId, typeAndDevice, constructionId, supervisionId } = this.model.form
            if (designId === null || typeAndDevice === null || constructionId === null || supervisionId === null) {
              this.$message.warning('请选择单位与设备')
              return
            }
            if (notEmptyArray(rooms)) {
              this.model.form.rooms = Array.from(new Set(rooms.map(v => v.val.trim()))) // 过滤 + 去重
            } else {
              this.$message.warning('请填写单位下业主房间编号')
              return
            }
          } else {
            const { principalId } = this.model.form
            this.model.form.rooms = null
            if (principalId === null) {
              this.$message.warning('请选择委托代理人')
              return
            }
          }
          // this.model.form.address = address.community.concat(address.county)
          this.formLoading = true
          addApi(this.model.form).then(res => {
            this.model.visible = false
            this.listApplies()
          }).catch(() => {
            this.$message.error('新增申请失败')
          })
            .finally(() => {
              this.formLoading = false
              this.model.form.rooms = [{ key: 'defaultRoom', val: '' }]
            })
        }
      })
      //  else {
      //   this.$message.error(Object.values(errors)[0][0].message)
      // }
    },
    // 获取申请列表
    async listApplies() {
      this.listLoading = true
      await listApi({}, {}).then(res => {
        this.list = []
        if (notEmptyArray(res.content)) {
          // this.list = res.content
          res.content.forEach(v => {
            v.apply = {}
            v.isDelegated = false
            if (this.$store.getters.roles[0] === 'ROLE_RESIDENT' && v.isEntrust === 0) {
              v.isDelegated = true
            }
            this.list.push(v)
          })
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
