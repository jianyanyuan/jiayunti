<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2021-03-16 09:55:31
 * @Description: 现场照片
 * @FilePath:
-->
<template>
  <div class="app-container">
    <el-page-header
      content="现场照片"
      class="gap-bottom-public"
      @back="$router.go(-1)"
    />
    <el-dialog
      center
      title="现场照片"
      :visible.sync="uploadVisible"
      :close-on-click-modal="false"
      class="uploadModal"
    >
      <el-upload
        ref="upload"
        :file-list="uploadList"
        action="#"
        :on-remove="handleUploadRemove"
        :on-change="handleUploadChange"
        :on-preview="handleLocalePreview"
        :auto-upload="false"
        list-type="picture-card"
      >
        <!-- <div>将文件拖到此处，或点击添加</div>
        <div>单个文件大小不超过20MB，可上传图片或PDF</div> -->
        <i class="el-icon-plus" />
      </el-upload>
      <!-- <span slot="footer">
        <el-button size="small" type="primary" @click="handleUpload">上 传</el-button>
      </span> -->
    </el-dialog>
    <el-dialog
      center
      title="现场照片"
      :visible.sync="dialogImageVisible"
      class="dialog-center-public"
    >
      <img :src="dialogImageUrl" alt="现场照片">
    </el-dialog>
  </div>
</template>

<script>
import { notEmptyArray, checkUpload } from '@/utils'

import File from '@/api/file'
export default {
  name: 'ResidentContract',

  data() {
    return {
      dialogImageVisible: false,
      dialogImageUrl: '',
      uploadList: [],
      projectId: null
    }
  },
  computed: {},
  created() {
    const { id } = this.$route.params
    if (isFinite(+id)) {
      this.projectId = id
      this.getFiles()
    }
  },
  methods: {
    // 获取现场照片
    getFiles() {
      this.uploadList = []

      File.get({ projectId: this.projectId, typeName: 'locale-form' }).then(
        (res) => {
          if (notEmptyArray(res.content)) {
            for (const i of res.content) {
              this.uploadList.push({
                uid: i.id,
                name: i.filename,
                url: i.path
              })
            }
          }
        }
      )
    },
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
        await File.upload(formData, {
          projectId: this.projectId,
          typeName: 'locale-form'
        })
          .then((res) => {
            file.uid = res.fileTypeId
            file.url = res.fileAddress
            file.status = 'success'
          })
          .catch(() => {
            // 上传失败
            this.$message.error('上传失败')
          })
      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList) {
      File.remove(file.uid).catch(() => {
        this.$message.error('删除失败')
      })
    },
    // 现场照片预览
    handleLocalePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogImageVisible = true
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id } = to.params
    if (isFinite(+id)) {
      next()
    } else {
      next('/redirect' + from.fullPath)
    }
  }
}
</script>

<style scoped>
</style>

