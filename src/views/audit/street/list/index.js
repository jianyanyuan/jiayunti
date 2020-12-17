/*
 * @Author: zfd
 * @Date: 2020-12-01 16:27:21
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-01 16:36:50
 * @Description:
 */
import { mapState } from 'vuex'
import Project from '@/api/projects'
import { notEmptyArray } from '@/utils'
import Flow from '@/components/street/Flow'
const data = {
  flowVisible: false,
  query: {
    code: '',
    applyName: '',
    statusId: ''
  },
  list: [
    // #region
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   designTime: '2020-10-14 10:56',
    //   auditTime: '2020-10-14 10:56',
    //   apply: {
    //     name: '李先生',
    //     address: '苏州高新区',
    //     phone: '15988800323',
    //     liftAddress: '小区1楼',
    //     spec: '高端电梯',
    //     time: '2020-10-13 11:46'
    //   },
    //   design: {
    //     org: '建研院',
    //     time: '2020-10-12 10:56',
    //     address: '苏州高新区',
    //     phone: '15988800323'
    //   },
    //   statusId: 13 // 施工中
    // },
    // {
    //   code: 'xxx小区xxxx幢xxx单元',
    //   designTime: '2020-10-14 10:56',
    //   auditTime: '2020-10-14 10:56',
    //   apply: {
    //     name: '李先生',
    //     address: '苏州高新区',
    //     phone: '15988800323',
    //     liftAddress: '小区1楼',
    //     spec: '高端电梯',
    //     time: '2020-10-14 08:00'
    //   },
    //   design: {
    //     org: '建研院',
    //     time: '2020-10-12 10:56',
    //     address: '苏州高新区',
    //     phone: '15988800323'
    //   },
    //   statusId: 8 // 街道审核
    // }
    // #endregion
  ],
  listLoading: false,
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
  },
  uploadModal: {
    visible: false
  }
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
      await Project.list({ page: this.pagination.pageIndex-1, size: this.pagination.pageSize }).then(res => {
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
    goSearch(){},
    clearQuery(){},
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
    // 图片上传之前判断
    uploadBefore(file) {
      const fileType = file.type
      const isImage = fileType.indexOf('image') !== -1
      const isBig = file.size <= 1024 * 1024 * 10
      if (!file) {
        this.$refs.upload.onError()
        this.$message.error('上传为空！')
        return false
      }
      if (!isImage) {
        this.$refs.upload.onError()
        this.$message.error('只能上传图片！')
        return false
      }
      if (!isBig) {
        this.$refs.upload.onError()
        this.$message.error('图片大小不能超过10MB！')
        return false
      }
      return true
    },
    // 图片上传成功之后回传
    uploadSuccess(res) { },
    // 图片上传失败
    uploadError() {
      this.$message.error('上传失败！')
    },
    // 图片移除
    uploadRemove(file) { },
    // 手动上传
    submitUpload() {
      this.$refs.upload.submit()
    }
  }
}
