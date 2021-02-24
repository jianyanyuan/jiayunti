/*
 * @Author: zfd
 * @Date: 2020-12-15 09:12:06
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:33:36
 * @Description: 增梯办列表
 */
// import Flow from '@/components/street/Flow'
import { mapState } from 'vuex'
import { listApi } from '@/api/projects'
import { notEmptyArray } from '@/utils'
import FilterList from '@/components/Filter'
export default {
  name: 'IncreaseLift',
  components: {
    FilterList
  },
  data() {
    return {
      expandLoading: false,
      flowVisible: false,

      list: [],
      listLoading: false,
      insStatus: [
        { key: 5, val: '管道踏勘' },
        { key: 10, val: '联合报告' },
        { key: 11, val: '施工监管' },
        { key: 12, val: '补贴派发' }
      ],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 30
      }
    }
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag'])
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
        this.expandLoading = true
        const apply = await this.$store.dispatch('getProjectBasic', row.id)
        const idx = this.list.findIndex(v => v.id === row.id)
        this.$set(this.list[idx], 'apply', apply)
        this.expandLoading = false
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
