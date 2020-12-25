/*
 * @Author: zfd
 * @Date: 2020-12-15 09:12:06
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-24 16:43:00
 * @Description: 增梯办列表
 */
// import Flow from '@/components/street/Flow'
import { mapState } from 'vuex'
import {listApi} from '@/api/projects'
import { notEmptyArray, checkUpload } from '@/utils'
export default {
  name: 'IncreaseLift',
  // components: {
  //   Flow
  // },
  data() {

    return {
      expandLoading: false,
      query: {
        code: '',
        applyName: '',
        designName: '',
        status: ''
      },
      flowVisible: false,

      list: [],
      listLoading: false,
      designStatus: [
        { key: 0, val: '未审核' },
        { key: 1, val: '审核未通过' },
        { key: 2, val: '审核通过' }
      ],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
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
        if (notEmptyArray(res.content)) {
          res.content.forEach(v => {
            v.apply = {}
            this.list.push(v)
          })
          this.pagination.total = res.totalElements
        }else {
          this.list = []
          this.pagination.total = 0
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
    flowView() {
      this.flowVisible = true
    },

    goSearch() {
    },
    clearQuery() {

    },

    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.listApplies()
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
      this.listApplies()
    },


  }
}