<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-04 15:51:54
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
        <upload-list :files="fileList[room]" list-type="picture-card" :disabled="true" :handle-preview="detailImg" />
      </el-card>
      <div style="text-align:center">
        <el-button type="primary" icon="el-icon-arrow-left" @click.native.prevent="nextProcess(-1)">上一步</el-button>

        <el-button type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>

      </div>
    </template>

    <template v-else>
      <el-card v-for="(room) in rooms" :key="room" class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>{{ room }}</span>
        </div>
        <el-upload action="#" :on-remove="function(file,fileList){return handleUploadRemove(file,fileList,room)}" :on-change="function(file,fileList){return handleUploadChange(file,fileList,room)}" list-type="picture" drag multiple :auto-upload="false">
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
    <el-dialog center title="图片详情" :visible.sync="imgVisible" :close-on-click-modal="false" class="dialog-center">
      <img :src="detailImgUrl" alt="意见咨询表">
    </el-dialog>
  </div>
</template>

<script>
import * as File from '@/api/file'
import { notEmptyArray } from '@/utils'
// import { deepClone } from '@/utils'

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
      imgVisible: false,
      detailImgUrl: '',
      hasChanged: false,
      // formLoading: false,
      pageLoading: false,
      rooms: ['401', '402', '403'],
      fileList: [], // 展示用
      uploadList: [], // 上传用
      deleteList: [] // 删除用
    }
  },

  computed: {
  },
  watch: {

  },
  created() {
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
      File.consultation({ projectId: this.id }).then(res => {
        console.log(res)
        if (notEmptyArray(res.content)) {
          for (let i in res.content) {
            const { room, opinionFiles } = i
            this.rooms.push(room)
            if (Array.isArray(opinionFiles)) {
              this.fileList[room] = []
              opinionFiles.forEach(v => {
                this.fileList[room].push({
                  uid: v.id,
                  name: v.fileName,
                  url: v.path
                })
              })
            }
          }
        }
        this.pageLoading = false
      }).catch(err => {
        console.log(err)
        this.$message.error('信息获取失败')
        this.pageLoading = false
      })
    },

    // 删除文件
    handleUploadRemove(file, fileList, room) {
      console.log(file)
      const index = this.fileList[room].findIndex(v => v.uid === file.uid)
      const file = this.fileList[room].splice(index, 1)
      this.deleteList.push({
        room,
        projectId: this.id,
        id: file.uid
      })
    },

    // 展示图片
    detailImg(file) {
      this.detailImgUrl = file.url
      this.imgVisible = true
    },

    nextProcess(arrow) {
      this.$emit('nextProcess', arrow)
    },
    // 上传文件发生改变时,支持选中多个文件
    handleUploadChange(file, fileList, room) {
      if (fileList.length > 0) {
        fileList.forEach(file => {
          if (this.uploadBefore(file)) {
            this.fileList[room].push({
              uid: file.uid,
              name: file.name,
              url: file.url
            })
            const formData = new FormData()
            formData.append('file', file)
            this.uploadList.push({
              room,
              projectId: this.id,
              file: formData
            })
          }
        })
      }
    },

    // 图片上传之前判断
    uploadBefore(file) {
      if (!file.size) {
        this.$message.error('上传为空！')
        return false
      }
      const typeAllowed = /\bpng|\bjpg/.test(file.type)
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

    // 保存修改
    postFile() {
      this.pageLoading = true
      const uploadAsync, deleteAsync
      if(notEmptyArray(this.uploadList)) {
        uploadAsync = new Promise((resolove,reject) => {
          this.uploadList.forEach
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.upload-card ::v-deep .el-card__body {
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
