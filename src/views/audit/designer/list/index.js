/*
 * @Author: zfd
 * @Date: 2020-12-10 11:06:02
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 16:02:00
 * @Description:
 */
import { mapState } from 'vuex'
// import Flow from '@/components/street/Flow'
import File from '@/api/file'
import { listApi, advanceApi } from '@/api/projects'
import { notEmptyArray, checkUpload } from '@/utils'
import FilterList from '@/components/Filter'
import CreateButtons from '@/mixin/createButtons'

export default {
  name: 'DesignerList',
  components: {
    // Flow
    FilterList
  },
  mixins: [CreateButtons],
  data() {
    return {
      flowVisible: false,
      list: [],
      listLoading: false,
      designStatus: [
        { key: 2, val: '方案设计' },
        { key: 6, val: '施工图设计' },
        { key: 7, val: '施工图修改' }
      ],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 30
      },
      uploadVisible: false,
      uploadId: null, // 待施工图设计的工程id
      uploadLoading: false,
      uploadList: []
    }
  },
  computed: {
    ...mapState('project', ['applyStatus', 'applyTag'])
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
    // 上传施工图设计
    openUpload(id) {
      this.uploadId = id
      this.uploadVisible = true
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList) {
      const valid = checkUpload(file.raw)
      if (valid && file.url === undefined) {
        const formData = new FormData()
        formData.append('file', file.raw)
        this.uploadList.push({
          projectId: this.uploadId,
          uid: file.uid,
          name: file.name,
          file: formData
        })
      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList) {
      // 未上传 --> 取消上传
      const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
      this.uploadList.splice(removeIdx, 1)
    },
    // 上传施工图设计稿
    async designUpload() {
      this.uploadLoading = true
      if (notEmptyArray(this.uploadList)) {
        let error = false
        // let last = true
        for (const idx in this.uploadList) {
          const { projectId, file } = this.uploadList[idx]
          await File.upload(file, { projectId, typeName: 'construction-design' })
            .catch(() => {
              // 上传失败
              const failIdx = this.$refs.constructionUpload.uploadFiles.findIndex(f => f.uid === this.uploadList[idx].uid)
              this.$refs.constructionUpload.uploadFiles.splice(failIdx, 1)
              error = true
            })
        }
        this.uploadList = []
        if (error) {
          this.$message.error('文件上传失败')
          this.uploadLoading = false
        } else {
          this.$message.success('上传完成')
          this.$refs.constructionUpload.uploadFiles = []
          this.uploadLoading = false
          // 施工图设计阶段 --> 施工图审核
          advanceApi(this.uploadId, 6)
            .then(async() => {
              await this.listApplies()
              this.uploadVisible = false
              this.uploadId = null
            })
            .catch(() => (this.$message.error('流程错误')))
        }
      } else {
        this.$message.error('请上传施工图设计稿')
      }
    },
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
