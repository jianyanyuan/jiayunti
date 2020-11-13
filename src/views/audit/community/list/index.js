import { mapState } from 'vuex'
import Flow from '@/components/street/Flow'
export default {
  components: {
    Flow
  },
  data() {
    return {
      pagination: {
        total: 20,
        pageIndex: 1,
        pageSize: 10
      },
      query: {
        code: '',
        applyName: '',
        status: ''
      },
      list: [
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-12 10:56',
          auditTime: '2020-10-14 10:56',
          status: 1 // 社区受理
        },
        {
          code: 'xxx小区xxxx幢xxx单元',
          applyTime: '2020-10-13 11:46',
          auditTime: '2020-10-14 10:56',
          status: 3 // 公示阶段
        }
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
      }
    }
  },
  computed: {
    ...mapState('common', ['applyStatus', 'applyTag'])
  },
  created() {
  },
  methods: {
    goSearch() { },
    clearQuery() { },
    flowView() {
      this.flowVisible = true
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
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
