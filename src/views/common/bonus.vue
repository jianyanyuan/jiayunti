<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-21 17:02:20
 * @Description: 补贴派发
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>补贴派发</span>
      <el-button v-if="!uploaded" type="success" style="float:right" @click="handlePost">提 交</el-button>
    </el-row>

    <el-card class="upload-card" style="margin-bottom:30px">
      <el-form :model="model" :rules="model.rule">
        <el-form-item label="补助金额（元）:" prop="money">
          <el-input v-model="model.money" />
        </el-form-item>
        <el-form-item label="证明材料:" prop="attachments">
          <el-upload v-if="model.attachments.length === 0 && isIns" action="#" :on-remove="handleUploadRemove" :on-change="function(file,fileList){return handleUploadChange(file,fileList)}" list-type="picture" drag multiple :auto-upload="false">
            <!-- <i class="el-icon-upload" /> -->
            <div>将文件拖到此处，或点击添加</div>
            <p>单个文件大小不超过20MB</p>
          </el-upload>
          <upload-list v-else :files="model.attachments" list-type="picture-card" :disabled="true" :handle-preview="detailFile" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog center title="图片详情" :visible.sync="imgVisible" :close-on-click-modal="false" class="dialog-center">
      <img :src="detailImgUrl" alt="授权委托书">
    </el-dialog>
    <el-dialog title="pdf预览" center :visible.sync="pdfVisible" :close-on-click-modal="false" class="dialog-center">
      <!-- 加载全部页面的PDF是一个for循环,不能指定用来打印的ref -->
      <div ref="printContent">
        <Pdf v-for="i in pdfPages" :key="i" :src="pdfURL" :page="i" />
      </div>
      <span slot="footer">
        <el-button @click="printPDF" type="success">打印</el-button>
        <!-- <el-button type="primary" @click="printImg">转图片打印</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import File from '@/api/file'
import Project from '@/api/projects'
import { notEmptyArray, checkUpload } from '@/utils'
import mixin from '@/components/UploadList/mixin'
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
export default {
  name: 'Bonus',
  mixins: [mixin],
  data() {
    return {
      // 修改后重新保存
      pageLoading: false,
      uploadList: [], // 上传用
      model: {
        money: '',
        attachments: [],
        rule: {
          money: [{ required: true, validator: formatterDecimal, message: "请给出补助金额", trigger: 'blur' }],
          attachments: [{ required: true, message: "请上传证明材料" }]
        }
      },
      projectId: null, // 工程id
      status: null, // 工程阶段标识位
      typeName: 'bonus',
      uploaded: false
    }
  },

  computed: {
    isIns() {
      return this.$store.getters.roles.includes('ROLE_INCREASE_LIFT')
    }
  },
  watch: {

  },
  created() {
    const { id, status } = this.$route.params
    //12 补贴派发
    if (!isNaN(+id) && status == 12) {
      this.projectId = id
      this.status = status
      this.detailApply()
    }
  },
  methods: {
    async detailApply() {
      this.pageLoading = true
      await Project.getBonus(this.projectId)
        .then((res) => {
          if (res) {
            this.uploaded = true
            const reg = /(?=(\B\d{3})+$)/g
            this.model.money = res.money.toString().replace(reg, ',')
            this.model.attachments = res.fileTypes.map(v => ({ uid: v.id, name: v.filename, url: v.path }))
          }
        })
        .catch(() => {
          this.$message.error('信息获取失败')
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    // 保存修改
    async handlePost() {
      this.pageLoading = true
      let error = false
      if (this.uploadList.length === 0) {
        this.$message.error('请上传附件')
        return
      }
      this.uploadList.forEach(async (v, i) => {
        const { file } = v
        await File.upload(file, { typeName: this.typeName, projectId: this.projectId })
          .then(() => {
            this.uploadList.splice(i, 1)
          })
          .catch(() => {
            // 上传失败
            error = true
          })
      })
      if (error) {
        this.$message.error('保存失败，请重新保存')
        return
      }
      await Project.addBonus({ id: this.projectId, money: this.model.money })
        .then(() => {
          this.subsidyVisible = false
        })
        .catch(() => {
          this.$message.error('保存失败')
        })
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList) {
      const valid = checkUpload(file.raw)
      if (valid && file.status === 'ready') {
        const formData = new FormData()
        formData.append('file', file.raw)
        this.uploadList.push({
          uid: file.uid,
          file: formData
        })
      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList) {
      // 未上传 --> 取消上传
      // const cancelIdx = this.fileList.findIndex(f => f.uid === file.uid)
      // this.fileList.splice(cancelIdx, 1)
      const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
      this.uploadList.splice(removeIdx, 1)
    },
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    //12 补贴派发
    const illegal = isNaN(+id) || status != 12

    if (illegal) {
      next('/redirect' + from.fullPath)
    }
    next()
  }
}
</script>

<style scoped lang="scss">
.upload-card ::v-deep .el-card__body {
  text-align: center;
  margin-bottom: 30px;
}
.enclosure-tips {
  color: #14274e;
  text-align: left;
  li {
    list-style: decimal;
  }
}
.upload-card ::v-deep .el-upload-dragger {
  width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
.image-container {
  height: 200px;
  margin-bottom: 20px;
  img {
    width: auto;
    height: auto;

    max-width: 100%;
    max-height: 100%;
  }
}
</style>
