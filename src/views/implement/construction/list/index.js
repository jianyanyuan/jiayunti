/*
 * @Author: zfd
 * @Date: 2020-12-10 11:06:02
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:26:31
 * @Description:
 */
import { mapState } from 'vuex'
// import Flow from '@/components/street/Flow'
import { listApi } from '@/api/projects'
import { notEmptyArray } from '@/utils'
import Construction from '@/api/construction'
import FilterList from '@/components/Filter'
export default {
  name: 'DesignerList',
  components: {
    FilterList
  },
  data() {
    return {
      flowVisible: false,
      conStatus: [
        { key: 8, val: '报价' },
        { key: 11, val: '施工中' }
      ],
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
    async willOffer(row) {
      let valid = true
      await Construction.getProOffer(row.id).then((res) => {
        if (Object.keys(res).length !== 0) {
          valid = false
        }
      })
        .catch(() => {
          valid = false
        })
      if (valid) {
        this.$router.push({ name: 'ConstructionProcess', params: { id: row.id, status: row.statusId }})
      } else {
        this.$message.error('请勿重复报价')
      }
    },
    async willComplete(row) {
      let valid = true
      await Construction.isResolved(row.id).then((res) => {
        if (res.result !== 0) {
          valid = false
        }
      })
        .catch(() => {
          valid = false
        })
      if (valid) {
        this.$router.push({ name: 'ConstructionComplete', params: { id: row.id, status: row.statusId }})
      } else {
        this.$message.error('违规未处理完毕!')
      }
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
