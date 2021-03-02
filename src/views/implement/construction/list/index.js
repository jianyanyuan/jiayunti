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
import { notEmptyArray, checkUpload } from '@/utils'
import Construction from '@/api/construction'
import FilterList from '@/components/Filter'
import File from '@/api/file'

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
    // async willOffer(row) {
    //   let valid = true
    //   await Construction.getProOffer(row.id).then((res) => {
    //     if (Object.keys(res).length !== 0) {
    //       valid = false
    //     }
    //   })
    //     .catch(() => {
    //       valid = false
    //     })
    //   if (valid) {
    //     this.$router.push({ name: 'ConstructionProcess', params: { id: row.id, status: row.statusId }})
    //   } else {
    //     this.$message.error('请勿重复报价')
    //   }
    // },
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
    },
    // 上传现场照片
    openUpload(id) {
      this.uploadList = []

      File.get({ projectId: id, typeName: 'locale-form' })
        .then(res => {
          if (notEmptyArray(res.content)) {
            for (const i of res.content) {
              this.uploadList.push({
                uid: i.id,
                name: i.filename,
                url: i.path
              })
            }
          }
        })
        .finally(() => {
          this.uploadId = id
          this.uploadVisible = true
        })
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    async handleUploadChange(file, fileList) {
      const isImage = /\bimage/i.test(file.raw.type)
      if (!isImage) {
        this.$message.warning('只能上传图片')
        fileList.pop()
        return
      }

      const valid = checkUpload(file.raw)
      if (valid) {
        const formData = new FormData()
        formData.append('file', file.raw)
        await File.upload(formData, { projectId: this.uploadId, typeName: 'locale-form' })
          .then(res => {
            file.uid = res.fileTypeId
            file.url = res.fileAddress
            file.status = 'success'
          })
          .catch(() => {
            // 上传失败
            this.$message.error('上传失败')
            // const failIdx = this.$refs.contractUpload.uploadFiles.findIndex(f => f.uid === this.contractList[idx].uid)
            // this.$refs.contractUpload.uploadFiles.splice(failIdx, 1)
            // error = true
          })
      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList) {
      File.remove(file.uid)
        .then(() => {
          // this.contractList.splice(removeIdx, 1)
        })
        .catch(() => {
          this.$message.error('删除失败')
        })
      // const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
      // if (file.url) {
      //   // 已上传
      //   File.remove(file.uid)
      //     .then(() => {
      //       this.uploadList.splice(removeIdx, 1)
      //     })
      //     .catch(() => {
      //       this.$message.error('删除失败')
      //     })
      // } else {
      //   this.uploadList.splice(removeIdx, 1)
      // }
    },
    // 现场照片预览
    handleLocalePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    }
    // 上传合同
    // async handleUpload() {
    //   this.uploadList = this.uploadList.filter(v => v.file)
    //   this.uploadLoading = true
    //   if (notEmptyArray(this.uploadList)) {
    //     let error = false
    //     // let last = true
    //     for (const idx in this.uploadList) {
    //       const { projectId, file } = this.uploadList[idx]
    //       await File.upload(file, { projectId, typeName: 'locale-form' })
    //         .catch(() => {
    //           // 上传失败
    //           const failIdx = this.$refs.upload.uploadFiles.findIndex(f => f.uid === this.uploadList[idx].uid)
    //           this.$refs.upload.uploadFiles.splice(failIdx, 1)
    //           error = true
    //         })
    //     }
    //     this.uploadList = []
    //     if (error) {
    //       this.$message.error('文件上传失败')
    //       this.uploadLoading = false
    //     } else {
    //       this.$message.success('上传完成')
    //       this.uploadVisible = false
    //       this.uploadId = null
    //       this.$refs.upload.uploadFiles = []
    //       this.uploadLoading = false
    //     }
    //   } else {
    //     this.uploadVisible = false
    //     this.uploadId = null
    //     this.$refs.upload.uploadFiles = []
    //     this.uploadLoading = false
    //   }
    // }

  }
}
