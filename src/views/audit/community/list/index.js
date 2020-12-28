/*
 * @Author: zfd
 * @Date: 2020-11-11 10:16:08
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-28 11:28:16
 * @Description: 社区端列表
 */
import { mapState } from 'vuex'
// import Flow from '@/components/street/Flow'
import { listApi } from '@/api/projects'
import { notEmptyArray } from '@/utils'


export default {
  name: 'CommunityList',
  // components: {
  //   Flow
  // }, 
  data() {
    return {
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      query: {
        code: '',
        applyName: '',
        audit: ''
      },
      list: [],
      listLoading: false,
      isFinished: false,
      flowVisible: false
    }
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag', 'auditOptions'])
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
          this.list = res.content
          this.pagination.total = res.totalElements
        }
      }).catch(err => {
        this.$message.error('数据获取失败')
        console.log(err)
      })
      this.listLoading = false
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
    },
    saveRecord() {
      const isFinished = this.model.tableData.filter(v => {
        return !v.isComplete
      })
      if (isFinished.length === 0) {
        this.isFinished = true
      } else {
        this.isFinished = false
        this.model.visible = false
      }
    },
    completed() {
      this.model.visible = false
    }
  }
}
