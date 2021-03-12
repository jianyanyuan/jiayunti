/*
 * @Author: zfd
 * @Date: 2020-12-01 16:27:21
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-29 14:47:39
 * @Description: 监理列表
 */
import { mapState, mapGetters } from 'vuex'
import { listApi } from '@/api/projects'
import { notEmptyArray } from '@/utils'
// import Flow from '@/components/street/Flow'
import FilterList from '@/components/Filter'
import CreateButtons from '@/mixin/createButtons'

export default {
  name: 'SupList',
  components: {
    FilterList
  },
  mixins: [CreateButtons],

  data() {
    return {
      flowVisible: false,
      list: [],
      listLoading: false,
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 30
      }
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
          this.list = res.content
          this.pagination.total = res.totalElements
        }
      }).catch(() => {
        this.$message.error('数据获取失败')
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
