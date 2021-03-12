import { mapState, mapGetters } from 'vuex'
import File from '@/api/file'
import { deepClone, notEmptyArray, checkUpload } from '@/utils'
import Pdf from 'vue-pdf'
import html2canvas from 'html2canvas'
import printJS from 'print-js'
import { validatePhone, validateTrueName } from '@/utils/element-validator'
import CreateButtons from '@/mixin/createButtons'
// import Flow from '@/components/street/Flow'
import { cancelApi, listApi, addApi } from '@/api/projects'
const defaultForm = {
  applicantName: '',
  applyMode: 'self',
  location: [],
  phoneNumber: '',
  address: { county: [], community: [] }, //
  designId: null,
  typeAndDevice: null, // []
  constructionId: null,
  supervisionId: null,
  principalId: null,
  rooms: [{ key: 'defaultRoom', val: '' }]
}

export default {
  name: 'ResidentList',
  // components: {
  //   Flow
  // },
  components: {
    Pdf
  },
  mixins: [CreateButtons],
  data() {
    return {
      dialogImageVisible: false,
      dialogImageUrl: '',
      pdfURL: '',
      pdfVisible: false,
      pdfPages: undefined, // pdf内容
      uploadVisible: false,
      uploadId: null,
      formLoading: false,
      listLoading: false,
      openLoading: false,
      flowVisible: false,
      audit: {},
      model: {
        visible: false,
        form: deepClone(defaultForm),
        rules: {
          applicantName: [{ required: true, validator: validateTrueName, trigger: 'blur' }],
          address: [{ required: true, message: '请选择地址' }],
          phoneNumber: [{ required: true, validator: validatePhone, trigger: 'blur' }],
          location: [{ required: true, message: '请输入地址' }]
        }
      },
      list: [],
      countyProps: {
        value: 'id',
        label: 'name',
        children: 'areas'
      },
      communityProps: {
        value: 'id',
        label: 'name',
        children: 'communities'
      },
      // expandLoading: false,
      communityOptions: [],
      contractList: [],
      contractUpload: true,
      uploadLoading: false
    }
  },
  computed: {
    ...mapState('common', ['handleStatus', 'handleTag']),
    ...mapState('project', ['applyTag']),
    ...mapGetters('project', ['validApplyStatus']),

    ...mapGetters('common', ['countyOptions', 'deviceOptions', 'designOptions', 'supervisionOptions', 'constructionOptions', 'trusteeOptions'])
  },
  watch: {
  },
  created() {
    this.listApplies()
  },
  methods: {
    // getButtons(row) {
    //   const { id, statusId, isEntrust, whetherThrough } = row
    //   const userInfo = {
    //     roles: this.$store.getters.roles
    //   }
    //   const projectInfo = {
    //     id,
    //     status: statusId,
    //     isDelegated: isEntrust === 0, // 0委托
    //     isPass: whetherThrough === 0 ? undefined : whetherThrough
    //   }
    //   return createButtons(this.$store.state.project.operations, userInfo, projectInfo) || []
    // },
    async handleExpand(row, expandedRows) {
      if (Object.keys(row.apply).length === 0) {
        // this.expandLoading = true
        const apply = await this.$store.dispatch('getProjectBasic', row.id)
        const idx = this.list.findIndex(v => v.id === row.id)
        this.$set(this.list[idx], 'apply', apply)
        // this.expandLoading = false
      }
    },
    // 打开申请Modal
    openAdd() {
      // 重置表格
      this.openLoading = true
      // const { address } = this.model.form
      this.model.form = deepClone(defaultForm)
      this.model.form.address = this.$store.getters['addressPlain']
      // this.model.form.address = address // 修复el-cascader bug
      this.model.form.applicantName = this.$store.getters.username
      // this.model.form.address.county = this.$store.getters['address']?.slice(0, 2)
      // this.communityOptions = this.$store.getters['common/communityOptions'](this.model.form.address.county)
      this.model.form.applyMode = 'self'
      // this.model.form.address.community = this.$store.getters['address']?.slice(2)
      this.model.form.phoneNumber = this.$store.getters['phone'] ?? ''
      this.model.visible = true
      this.openLoading = false
    },
    // 撤销申请
    cancelApply(row) {
      const { id } = row
      cancelApi(id).then(() => {
        this.listApplies()
      }).catch(() => {
        this.$message.error('撤销失败')
      })
    },
    // 提交申请
    postApply() {
      this.$refs.form.validate((valid, errors) => {
        if (valid) {
          const { location, rooms } = this.model.form
          if (notEmptyArray(location) && location.length === 3) {
            this.model.form.location = location.map(v => v.replace(/[<>&"']/gi, ' ').trim()) // 防止xss攻击
          } else {
            this.$message.error('请填写加装电梯地址')
            return
          }

          if (this.model.form.applyMode === 'self') {
            const { designId, typeAndDevice, constructionId, supervisionId } = this.model.form
            if (designId === null || typeAndDevice === null || constructionId === null || supervisionId === null) {
              this.$message.error('请选择单位与设备')
              return
            }
            if (notEmptyArray(rooms)) {
              this.model.form.rooms = Array.from(new Set(rooms.map(v => v.val.replace(/[<>&"']/gi, ' ').trim()))) // 过滤 + 去重
            } else {
              this.$message.error('请填写单位下业主房间编号')
              return
            }
          } else {
            const { principalId } = this.model.form
            this.model.form.rooms = null
            if (principalId === null) {
              this.$message.error('请选择委托代理人')
              return
            }
          }
          // this.model.form.address = address.community.concat(address.county)
          this.formLoading = true
          addApi(this.model.form).then(res => {
            this.model.visible = false
            this.listApplies()
          }).catch(() => {
            this.$message.error('新增申请失败')
          })
            .finally(() => {
              this.formLoading = false
              this.model.form.rooms = [{ key: 'defaultRoom', val: '' }]
            })
        }
      })
      //  else {
      //   this.$message.error(Object.values(errors)[0][0].message)
      // }
    },
    // 获取申请列表
    async listApplies() {
      this.listLoading = true
      await listApi({}, {}).then(res => {
        this.list = []
        if (notEmptyArray(res.content)) {
          // this.list = res.content
          if (notEmptyArray(res.content)) {
            res.content.forEach(v => {
              v.apply = {}
              v.isDelegated = false
              if (this.$store.getters.roles[0] === 'ROLE_RESIDENT' && v.isEntrust === 0) {
                v.isDelegated = true
              }
              this.list.push(v)
            })
          }
        }
      }).catch(() => {
        this.$message.error('数据获取失败')
      })
      this.listLoading = false
    },
    // flowView(row, column, event) {
    //   if (row.status !== 0) {
    //     this.flowVisible = true
    //   }
    // },

    handleRoom(index) {
      if (index === 0) {
        this.model.form.rooms.push({ key: Date.now(), val: '' })
      } else {
        this.model.form.rooms.splice(index, 1)
      }
    },
    resetFrom(formName) {
      this.$refs[formName].clearValidate()
    },
    // 上传合同
    openUpload(row) {
      const { isEntrust, id } = row
      this.contractList = []
      this.contractUpload = true

      if (this.$store.getters.roles[0] === 'ROLE_RESIDENT' && isEntrust === 0) {
        this.contractUpload = false
      }
      File.get({ projectId: id, typeName: 'apply-contract' })
        .then(res => {
          if (notEmptyArray(res.content)) {
            for (const i of res.content) {
              const file = {
                uid: i.id,
                name: i.filename,
                url: i.path
              }
              if (/\bpdf/i.test(i.filename)) {
                file.url = require('@/assets/images/pdf.jpg')
                file.path = i.path
              }
              this.contractList.push(file)
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
      const valid = checkUpload(file.raw)
      if (valid) {
        const formData = new FormData()
        formData.append('file', file.raw)
        const isPdf = /\bpdf/i.test(file.raw.type)
        if (isPdf) file.url = require('@/assets/images/pdf.jpg')
        await File.upload(formData, { projectId: this.uploadId, typeName: 'apply-contract' })
          .then(res => {
            if (isPdf) {
              file.path = res.fileAddress
            } else {
              file.url = res.fileAddress
            }
            file.status = 'success'

            file.uid = res.fileTypeId
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
      // if (valid && file.url === undefined) {
      //   const formData = new FormData()
      //   formData.append('file', file.raw)
      //   this.contractList.push({
      //     projectId: this.uploadId,
      //     uid: file.uid,
      //     name: file.name,
      //     file: formData
      //   })
      // } else {
      //   fileList.pop()
      // }
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
      // 未上传 --> 取消上传
      // const removeIdx = this.contractList.findIndex(f => f.uid === file.uid)
      // if (file.url) {
      //   // 已上传

      // } else {
      //   this.contractList.splice(removeIdx, 1)
      // }
    },
    // 上传合同
    // async handleUpload() {
    //   this.uploadLoading = true
    //   this.contractList = this.contractList.filter(v => v.file)

    //   if (notEmptyArray(this.contractList)) {
    //     let error = false
    //     // let last = true
    //     for (const idx in this.contractList) {
    //       const { projectId, file } = this.contractList[idx]
    //       await File.upload(file, { projectId, typeName: 'apply-contract' })
    //         .catch(() => {
    //           // 上传失败
    //           const failIdx = this.$refs.contractUpload.uploadFiles.findIndex(f => f.uid === this.contractList[idx].uid)
    //           this.$refs.contractUpload.uploadFiles.splice(failIdx, 1)
    //           error = true
    //         })
    //     }
    //     this.contractList = []
    //     if (error) {
    //       this.$message.error('文件上传失败')
    //       this.uploadLoading = false
    //     } else {
    //       this.$message.success('上传完成')
    //       this.uploadVisible = false
    //       this.uploadId = null
    //       this.$refs.contractUpload.uploadFiles = []
    //       this.uploadLoading = false
    //     }
    //   } else {
    //     this.uploadVisible = false
    //     this.uploadId = null
    //     this.$refs.contractUpload.uploadFiles = []
    //     this.uploadLoading = false
    //   }
    // },
    // 合同预览
    handleContractPreview(file) {
      const url = file.path || file.url
      const isPdf = /\bpdf/i.test(file.name) || /\bpdf$/i.test(url)
      if (isPdf) {
        // 展示pdf
        this.pdfURL = Pdf.createLoadingTask(url)
        this.pdfURL.promise.then(pdf => {
          this.pdfPages = pdf.numPages
          this.pdfVisible = true
        }).catch(() => {
          this.$message.error('pdf预览失败')
        })
      } else {
        this.dialogImageUrl = file.url
        this.dialogImageVisible = true
      }
    },
    // 打印pdf
    printPDF(refName) {
      html2canvas(this.$refs[refName], {
        backgroundColor: null,
        useCORS: true,
        windowHeight: 0
      }).then((canvas) => {
        const url = canvas.toDataURL()
        printJS({
          printable: url,
          type: 'image',
          documentTitle: this.printName
        })
        // console.log(url)
      })
    }
  }
}
