/*
 * @Author: zfd
 * @Date: 2020-12-10 11:06:02
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-10 17:26:38
 * @Description: 
 */
import { mapState } from 'vuex'
import Flow from '@/components/street/Flow'
import * as File from '@/api/file'
import Project from '@/api/projects'
export default {
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
      uploadVisible:false,
      fileList: [],
      uploadList: [],
      expandLoading:false
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
      await Project.list({ page: this.pagination.pageIndex - 1, size: this.pagination.pageSize }).then(res => {
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
    async handleExpand(row, expandedRows) {
      if(!row.apply) {
        this.expandLoading = true
        row.apply = await this.$store.dispatch('getProjectBasic', this.id)
        this.expandLoading = false
      }
    },
    flowView() {
      this.flowVisible = true
    },
    goSearch() { },
    clearQuery() { },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList) {
      const valid = this.checkUpload(file.raw)
      if (valid && file.status === 'ready') {
        const formData = new FormData()
        formData.append('file', file.raw)
        this.uploadList.push({
          projectId: this.id,
          uid: file.uid,
          name: file.name,
          file: formData
        })
      } else {
        fileList.pop()
      }
    },
    // 图片上传之前判断
    checkUpload(file) {
      if (!file.size) {
        this.$message.error('上传为空！')
        return false
      }
      const typeAllowed = /\bpdf|\bimage/i.test(file.type)
      const isBig = file.size <= 1024 * 1024 * 10 // 单个文件最大10M
      if (!typeAllowed) {
        this.$message.error('只能上传图片或pdf！')
        return false
      }
      if (!isBig) {
        this.$message.error('图片大小不能超过10MB！')
        return false
      }
      return true
    },
    // 删除文件
    handleUploadRemove(file, fileList) {
      // 未上传 --> 取消上传
      // const cancelIdx = this.fileList.findIndex(f => f.uid === file.uid)
      // this.fileList.splice(cancelIdx, 1)
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
          await File.upload(file, { projectId, typeName: 'construction-design' })
            .then(() => {
              this.uploadList.splice(i, 1)
            })
            .catch(() => {
              // 上传失败
              error = true
            })
            if(error) {
              this.$message.error('上传失败')
            }else {
              this.uploadVisible = false
            }
        })
      }
    }
  }
}