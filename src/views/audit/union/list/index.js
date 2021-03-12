/*
 * @Author: zfd
 * @Date: 2020-12-01 16:27:21
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:29:18
 * @Description:
 */
import { mapState, mapGetters } from 'vuex'
import { listApi } from '@/api/projects'
import { notEmptyArray } from '@/utils'
// import Flow from '@/components/street/Flow'
import FilterList from '@/components/Filter'
import CreateButtons from '@/mixin/createButtons'

export default {
  name: 'UnionList',
  components: {
    FilterList
  },
  mixins: [CreateButtons],

  data() {
    return {
      flowVisible: false,
      query: {
        code: '',
        applyName: '',
        statusId: ''
      },
      list: [],
      listLoading: false,
      unionStatus: [
        { key: 10, val: '联合审查' }
      ],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 30
      },
      expandLoading: false
    }
  },
  computed: {
    ...mapState('project', ['applyTag']),
    ...mapGetters('project', ['validApplyStatus'])

  },
  created() {
    this.listApplies()
  },
  methods: {
    // 获取申请列表
    async listApplies(query = {}) {
      this.listLoading = true
      await listApi({ page: this.pagination.pageIndex - 1, size: this.pagination.pageSize }, query).then(res => {
        this.list = []
        this.pagination.total = 0
        if (notEmptyArray(res.content)) {
          res.content.forEach(v => {
            v.apply = {}
            this.list.push(v)
          })
          this.pagination.total = res.totalElements
        }
      }).catch(() => {
        this.$message.error('数据获取失败')
      })
      this.listLoading = false
    },
    async handleExpand(row, expandedRows) {
      if (Object.keys(row.apply).length === 0) {
        const apply = await this.$store.dispatch('getProjectBasic', row.id)
        const idx = this.list.findIndex(v => v.id === row.id)
        this.$set(this.list[idx], 'apply', apply)
      }
    },
    // flowView() {
    //   this.flowVisible = true
    // },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.listApplies()
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
      this.listApplies()
    }
  }
}
