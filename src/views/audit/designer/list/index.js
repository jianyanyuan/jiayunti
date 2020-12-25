/*
 * @Author: zfd
 * @Date: 2020-12-10 11:06:02
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-25 14:29:34
 * @Description: 
 */
import { mapState } from 'vuex'
// import Flow from '@/components/street/Flow'
import File from '@/api/file'
import {listApi,advanceApi} from '@/api/projects'
import { notEmptyArray,checkUpload } from '@/utils'
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
      list: [],
      listLoading: false,
      designStatus: [
        { key: 0, val: '未设计' },
        { key: 1, val: '审核中' },
        { key: 2, val: '审核未通过' },
        { key: 3, val: '审核通过' }
      ],
      designTag: [
        { key: 0, val: 'info' },
        { key: 1, val: 'warning' },
        { key: 2, val: 'danger' }
      ],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      uploadVisible: false,
      uploadId: null, // 待施工图设计的工程id
      fileList: [],
      uploadList: [],
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
    goSearch() { },
    clearQuery() { },
    // 上传施工图设计
    openUpload(id) {
      this.uploadId = id
      this.uploadVisible = true
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList) {
      const valid = checkUpload(file.raw)
      if (valid && file.status === 'ready') {
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
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.listApplies()
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
      this.listApplies()
    },
    // 上传施工图设计稿
    designUpload() {
      if (notEmptyArray(this.uploadList)) {
        let error = false
        this.uploadList.forEach(async (v, i) => {
          const { projectId, file } = v
          const last = i === this.uploadList.length - 1
          await File.upload(file, { projectId, typeName: 'construction-design' })
            .catch(() => {
              // 上传失败
              error = true
            })
          this.uploadList.splice(i, 1)
          if (last) {
            this.$refs.constructionUpload.uploadFiles = []
            if (error) {
              this.$message.error('文件上传失败，请重新上传')
            } else {
              this.$message.success('上传完成')
              // 施工图设计阶段 --> 施工图审核
              advanceApi(this.uploadId, 6)
                .catch(() => (this.$message.error('流程错误')))
              this.uploadVisible = false
              this.uploadId = null
              this.listApplies()

            }
          }
        })
      }
    }
  }
}