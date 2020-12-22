/*
 * @Author: zfd
 * @Date: 2020-12-10 11:06:02
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-17 09:56:18
 * @Description: 
 */
import { mapState } from 'vuex'
import Flow from '@/components/street/Flow'
import  { listApi } from '@/api/projects'
import { notEmptyArray } from '@/utils'
export default {
  name: 'DesignerList',
  components: {
    Flow
  },
  data() {
    return {
      flowVisible: false,
      query: {
        code: '',
        applyName: '',
        status: ''
      },
      designStatus:{},
      list: [],
      listLoading: false,
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      expandLoading: false
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
        }
      }).catch(err => {
        this.$message.error('数据获取失败')
        console.log(err)
      })
      this.listLoading = false
    },
    flowView() {
      this.flowVisible = true
    },
    goSearch() { },
    clearQuery() { },
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