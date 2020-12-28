/*
 * @Author: zfd
 * @Date: 2020-12-10 11:06:02
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-25 14:31:41
 * @Description: 
 */
import { mapState } from 'vuex'
// import Flow from '@/components/street/Flow'
import { listApi } from '@/api/projects'
import { notEmptyArray } from '@/utils'
import Construction from '@/api/construction'
export default {
  name: 'DesignerList',
  // components: {
  //   Flow
  // },
  data() {
    return {
      flowVisible: false,
      query: {
        code: '',
        applyName: '',
        status: ''
      },
      designStatus: {},
      list: [],
      listLoading: false,
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      expandLoading: false,
      btnLoading: false
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
    async willOffer(row) {
      let valid = true
      this.btnLoading = true
      await Construction.getProOffer(row.id).then((res) => {
        if (Object.keys(res).length !== 0) {
          valid = false
        }
      })
        .catch(() => {
          valid = false
        })
      this.btnLoading = false
      if (valid) {
        this.$router.push({ name: 'ConstructionProcess', params: { id: row.id, status: row.statusId } })
      } else {
        this.$message.error('请勿重复报价')
      }
    },
    async willComplete(row) {
      let valid = true
      this.btnLoading = true
      await Construction.isResolved(row.id).then((res) => {
        if (res.result !== 0) {
          valid = false
        }
      })
        .catch(() => {
          valid = false
        })
      this.btnLoading = false
      if (valid) {
        this.$router.push({ name: 'ConstructionComplete', params: { id: row.id, status: row.statusId } })
      } else {
        this.$message.error('违规未处理完毕!')
      }
    },
    // flowView() {
    //   this.flowVisible = true
    // },
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