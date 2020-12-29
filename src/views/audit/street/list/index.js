/*
 * @Author: zfd
 * @Date: 2020-12-01 16:27:21
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-29 14:12:10
 * @Description:
 */
import { mapState } from 'vuex'
import { listApi } from '@/api/projects'
import { notEmptyArray } from '@/utils'
import FilterList from '@/components/Filter'

// import Flow from '@/components/street/Flow'
const defaultQuery = {
  applicantName: null,
  projectName: null,
  status: null
}
export default {
  components: {
    FilterList
  },
  data() {
    return {
      flowVisible: false,
      query: Object.assign({},defaultQuery),

      list: [],
      listLoading: false,
      streetStatus: [
        { key: 9, val: '街道审核' },
        { key: 11, val: '施工中' }
      ],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      uploadModal: {
        visible: false
      },
      expandLoading:false
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
      await listApi({ page: this.pagination.pageIndex - 1, size: this.pagination.pageSize },query).then(res => {
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
