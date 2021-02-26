/*
 * @Author: zfd
 * @Date: 2020-12-01 16:37:48
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:34:01
 * @Description:
 */
import { mapState } from 'vuex'
// import Flow from '@/components/street/Flow'
import { listApi } from '@/api/projects'
import { notEmptyArray } from '@/utils'
import FilterList from '@/components/Filter'
export default {
  name: 'DrawingList',
  components: {
    FilterList
  },
  data() {
    return {
      flowVisible: false,
      query: {
        code: '',
        applyName: '',
        designName: '',
        status: ''
      },
      list: [],
      listLoading: false,
      designStatus: [
        { key: 0, val: '未审核' },
        { key: 1, val: '审核未通过' },
        { key: 2, val: '审核通过' }
      ],
      designTag: [
        { key: 0, val: 'info' },
        { key: 1, val: 'danger' },
        { key: 2, val: 'success' }
      ],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 30
      }
    }
  },
  computed: {
    ...mapState('project', ['applyStatus', 'applyTag'])

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
