/*
 * @Author: zfd
 * @Date: 2020-12-01 16:37:48
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-25 14:30:29
 * @Description:
 */
import { mapState } from 'vuex'
// import Flow from '@/components/street/Flow'
import { listApi } from '@/api/projects'
import { notEmptyArray } from '@/utils'
export default {
  name: 'DrawingList',
  // components: {
  //   Flow
  // },
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
      expandLoading: false,
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
        pageSize: 10
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
    async listApplies() {
      this.listLoading = true
      await listApi({ page: this.pagination.pageIndex - 1, size: this.pagination.pageSize }).then(res => {
        this.list = []
        this.pagination.total = 0
        if (notEmptyArray(res.content)) {
          res.content.forEach(v => {
            v.apply = {}
            this.list.push(v)
          })
          this.pagination.total = res.totalElements
        }
      }).catch(err => {
        this.$message.error('数据获取失败')
        console.log(err)
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
    goSearch() { },
    clearQuery() { },
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