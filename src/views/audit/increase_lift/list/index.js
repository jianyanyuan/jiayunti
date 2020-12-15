/*
 * @Author: zfd
 * @Date: 2020-12-15 09:12:06
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-15 09:26:31
 * @Description: 增梯办列表
 */
import Flow from '@/components/street/Flow'
import { mapState } from 'vuex'
import Project from '@/api/projects'
import { notEmptyArray } from '@/utils'
export default {
  name: 'IncreaseLift',
  components: {
    Flow
  },
  data() {
    const formatterDecimal = (rule, value, callback) => {
      const number = +value
      if (isNaN(number)) {
        callback('请输入补助金额,数字格式')
      } else {
        const reg = /(?=(\B\d{3})+$)/g
        this.model.money = value.toString().replace(reg, ',')
        callback()
      }
    }
    return {
      expandLoading: false,
      subsidyVisible: false,
      query: {
        code: '',
        applyName: '',
        designName: '',
        status: ''
      },
      flowVisible: false,
      model: {
        money: '',
        attachment: [],
        rule: {
          money: [{ required: true, validator: formatterDecimal, trigger: 'blur' }],
          attachment: [{ required: true }]
        }
      },
      list: [],
      listLoading: false,
      designStatus: [
        { key: 0, val: '未审核' },
        { key: 1, val: '审核未通过' },
        { key: 2, val: '审核通过' }
      ],
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      uploadList:[],
      fileList:[],
      uploadModal: {
        visible: false
      }
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
    goSearch() {

    },
    clearQuery() {

    },
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
    submitUpload() {

    }

  }
}