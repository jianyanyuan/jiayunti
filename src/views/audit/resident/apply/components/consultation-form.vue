<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:15:27
 * @Description: 居民申请意见征询表
-->
<template>
  <div v-loading="pageLoading">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>意见征询表</span>
      <el-button v-if="hasChanged" type="primary" style="float:right" @click="hasChanged = !hasChanged">修改</el-button>
      <el-button v-else type="primary" style="float:right" @click="postFile">保存</el-button>
    </el-row>
    <template v-if="hasChanged">
      <el-card v-for="(room) in rooms" :key="room" class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>{{ room }}</span>
        </div>
        <upload-list :files="fileList[room]" list-type="picture-card" :disabled="true" />
      </el-card>

    </template>

    <template v-else>
      <el-card v-for="(room) in rooms" :key="room" class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>{{ room }}</span>
        </div>
        <el-upload action="#" :file-list="fileList[room]" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,room)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,room)}" drag :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
          <div class="enclosure-tips">
            所需附件：
            <ul>
              <li>
                业主身份证
              </li>
              <li>
                业主房产证
              </li>
              <li>
                意见征询表 / 征询表+委托书+受委托人身份证
              </li>
            </ul>
          </div>
          <div>将文件拖到此处，或点击添加</div>
          <p>单个文件大小不超过20MB，可上传图片或PDF</p>
        </el-upload>
      </el-card>
    </template>
    <div style="text-align:center">
      <el-button type="primary" icon="el-icon-arrow-left" @click.native.prevent="nextProcess(-1)">上一步</el-button>

      <el-button v-if="hasChanged" type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>
    </div>
  </div>
</template>

<script>
import File from '@/api/file'
import { notEmptyArray, checkUpload } from '@/utils'
export default {
  name: 'ApplyConsultation',
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      // 修改后重新保存
      hasChanged: false,
      pageLoading: false,
      rooms: [],
      fileList: {}, // 展示用
      uploadList: [], // 上传用
      deleteList: [] // 删除用
    }
  },

  computed: {
  },
  watch: {

  },
  created() {
    // this.detailApply()
  },
  activated() {
    this.detailApply()
  },
  methods: {

    // 获取已上传的意见征询表
    detailApply() {
      this.pageLoading = true
      this.rooms = []
      this.fileList = {}
      this.uploadList = []
      this.deleteList = []
      File.getConsultation({ projectId: this.id }).then(res => {
        if (notEmptyArray(res.content)) {
          for (const i of res.content) {
            const { room, opinionFileList } = i
            this.rooms.push(room)
            if (Array.isArray(opinionFileList)) {
              this.fileList[room] = []
              opinionFileList.forEach(v => {
                this.fileList[room].push({
                  uid: v.opinionFileId,
                  name: v.fileName,
                  url: v.path
                })
              })
            }
          }
        }
        this.pageLoading = false
      }).catch(() => {
        this.$message.error('信息获取失败')
        this.pageLoading = false
      })
    },

    nextProcess(arrow) {
      if (arrow > 0) {
        const count = this.rooms.reduce((c, v) => (this.fileList[v].length + c), 0)
        if (count >= this.rooms.length * 3) {
          this.$emit('nextProcess', arrow)
        } else {
          this.$message.error('请补全附件，附件分开上传')
        }
      } else {
        this.$emit('nextProcess', arrow)
      }
    },

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList, room) {
      const valid = checkUpload(file.raw)
      if (valid && file.url === undefined) {
        const reader = new FileReader()
        reader.readAsDataURL(file.raw)
        reader.onload = (event) => {
          this.fileList[room].push({
            uid: file.uid,
            name: file.name,
            url: event.target.result // 临时保存base64结果
          })
        }
        const formData = new FormData()
        formData.append('file', file.raw)
        this.uploadList.push({
          room,
          projectId: this.id,
          uid: file.uid,
          name: file.name,
          file: formData
        })
      } else {
        fileList.pop()
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList, room) {
      // const index = this.fileList[room].findIndex(v => v.uid === file.uid)
      // const removed = this.fileList[room].splice(index, 1)
      const cancelIdx = this.fileList[room].findIndex(f => f.uid === file.uid)
      this.fileList[room].splice(cancelIdx, 1)
      if (file.url === undefined) {
        // 未上传 --> 取消上传
        const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
        this.uploadList.splice(removeIdx, 1)
      } else {
        // 已上传的 --> 待删除
        this.deleteList.push(
          {
            room,
            projectId: this.id,
            uid: file.uid,
            name: file.name
          }
        )
      }
    },

    // 保存修改
    postFile() {
      this.pageLoading = true
      let uploadAsync = new Promise(resolove => resolove('未修改'))
      let deleteAsync = new Promise(resolove => resolove('未修改'))
      if (notEmptyArray(this.uploadList)) {
        let error = false
        uploadAsync = new Promise((resolove, reject) => {
          this.uploadList.forEach(async(v, i) => {
            const { room, projectId, file } = v

            const last = i === this.uploadList.length - 1
            await File.uploadOpinion(file, { room, projectId })
              .catch(() => {
                // 上传失败
                const failIdx = this.fileList[room].findIndex(f => f.uid === v.uid)
                this.fileList[room].splice(failIdx, 1)
                error = true
              })
            this.uploadList.splice(i, 1)
            if (last) {
              error ? (reject('部分文件上传失败')) : (resolove('上传完成'))
            }
          })
        })
      }
      if (notEmptyArray(this.deleteList)) {
        let error = false
        deleteAsync = new Promise((resolove, reject) => {
          this.deleteList.forEach(async(v, i) => {
            const last = i === this.deleteList.length - 1
            await File.removeOpinion(v.uid)
              // .then(() => {
              //   const delIndx = this.fileList[v.room].findIndex(f => f.uid === v.uid)
              //   this.fileList[v.room].splice(delIndx, 1)
              // })
              .catch(() => {
                this.fileList[v.room].push(v)
                error = true
              })
            if (last) {
              error ? (reject('部分文件删除失败')) : (resolove('删除完成'))
            }
            this.deleteList.splice(i, 1)
          })
        })
      }
      Promise.all([uploadAsync, deleteAsync]).then(() => {
        this.pageLoading = false
        this.hasChanged = true
      }).catch(() => {
        this.$message.error('保存失败')
        this.pageLoading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
.upload-card ::v-deep .el-card__body {
  margin-bottom: 30px;
  text-align: center;
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
  padding: 10px 5px;
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
