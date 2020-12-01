import { mapState } from 'vuex'
import Flow from '@/components/street/Flow'
import Project from '@/api/projects'
import { notEmptyArray } from '@/utils'

const data = {
  pagination: {
    total: 0,
    pageIndex: 1,
    pageSize: 10
  },
  query: {
    code: '',
    applyName: '',
    status: ''
  },
  list: [
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-12 10:56',
    //   auditTime: '2020-10-14 10:56',
    //   status: 1 // 社区受理
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   applyTime: '2020-10-13 11:46',
    //   auditTime: '2020-10-14 10:56',
    //   status: 3 // 公示阶段
    // }
  ],
  listLoading: false,
  isFinished: false,
  flowVisible: false,
  model: {
    title: '踏勘记录',
    visible: false,
    tableData: [
      {
        project: '线路',
        company: '',
        isComplete: false,
        time: '',
        result: ''
      },
      {
        project: '建筑',
        company: '',
        isComplete: false,
        time: '',
        result: ''
      },
      {
        project: '水管',
        company: '',
        isComplete: false,
        time: '',
        result: ''
      }
    ]
  },
  statusOptions: [
    { key: 1, val: '社区受理' },
    { key: 3, val: '公示阶段' }
  ]
}
export default {
  components: {
    Flow
  },
  data() {
    return data
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
      await Project.list({ page: this.pagination.pageIndex, size: this.pagination.pageSize }).then(res => {
        if (notEmptyArray(res.content)) {
          this.list = res.content
        }
      }).catch(err => {
        this.$message.error('数据获取失败')
        console.log(err)
      })
      this.listLoading = false
    },
    goSearch() { },
    clearQuery() { },
    flowView() {
      this.flowVisible = true
    },
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
