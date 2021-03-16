/*
 * @Author: zfd
 * @Date: 2020-12-10 11:06:02
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:26:31
 * @Description:
 */
import { mapState, mapGetters } from 'vuex'
// import Flow from '@/components/street/Flow'
import { listApi } from '@/api/projects'
import { notEmptyArray, checkUpload } from '@/utils'
import Construction from '@/api/construction'
import FilterList from '@/components/Filter'
import File from '@/api/file'
import CreateButtons from '@/mixin/createButtons'

export default {
  name: 'DesignerList',
  components: {
    FilterList
  },
  mixins: [CreateButtons],

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
        pageSize: 30
      },
      uploadVisible: false,
      uploadId: null,
      uploadList: [],
      dialogImageUrl: '',
      dialogImageVisible: false
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
