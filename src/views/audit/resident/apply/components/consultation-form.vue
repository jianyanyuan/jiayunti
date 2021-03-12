<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 12:57:05
 * @Description: 居民申请意见征询表
-->
<template>
  <div v-loading="pageLoading">
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>意见征询表</span>
      <!-- <el-button v-if="hasChanged && !$store.state.project.isDelegated" type="success" style="float:right" @click="handlePreview">预览</el-button> -->
      <template v-if="!$store.state.project.isDelegated">
        <el-button v-if="hasChanged" type="primary" style="float:right" @click="hasChanged = false">修改</el-button>
        <el-button v-else type="success" style="float:right" @click="handlePreview">预览</el-button>
      </template>
    </el-row>
    <template v-if="!$store.state.project.isDelegated && !hasChanged">
      <el-card v-for="(room) in rooms" :key="room" class="upload-card-public gap-bottom-public">
        <div slot="header">
          <span>{{ room }}</span>
        </div>
        <!-- function(file,fileList){return handleUploadChange(file,fileList,room)} -->
        <el-upload action="#" :file-list="fileList[room]" :on-remove="handleUploadRemove(file) " :on-change="handleUploadChange(file,fileList,room)" drag :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
          <div class="upload-tips-public">
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
    <template v-else>
      <el-card v-for="(room) in rooms" :key="room" class="upload-card-public" style="margin-bottom:30px">
        <div slot="header">
          <span>{{ room }}</span>
        </div>
        <upload-list :files="fileList[room]" list-type="picture-card" :disabled="true" />
      </el-card>

    </template>

    <div style="text-align:center">
      <el-button type="primary" icon="el-icon-arrow-left" @click.native.prevent="nextProcess(-1)">上一步</el-button>

      <el-button type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>
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
      fileList: {} // 展示用
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
    handlePreview() {
      this.hasChanged = true
      this.detailApply()
    },
    // 获取已上传的意见征询表
    async detailApply() {
      this.pageLoading = true
      this.rooms = []
      this.fileList = {}
      await File.getConsultation({ projectId: this.id }).then(res => {
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

    async nextProcess(arrow) {
      if (arrow > 0) {
        await this.detailApply()
        const count = this.rooms.reduce((c, v) => (this.fileList[v].length + c), 0)
        if (count >= this.rooms.length * 3) {
          this.$emit('nextProcess', arrow)
        } else {
          this.$message.error('附件未提交完成')
        }
      } else {
        this.$emit('nextProcess', arrow)
      }
    },

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList, room) {
      return function() {
        const valid = checkUpload(file.raw)
        if (valid && file.url === undefined) {
          const formData = new FormData()
          formData.append('file', file.raw)
          File.uploadOpinion(formData, { room, projectId: this.id })
            .catch(() => {
            // 上传失败
              this.$message.error('上传失败')
            })
        } else {
          fileList.pop()
        }
      }
    },
    // 删除文件
    handleUploadRemove(file, fileList, room) {
      File.removeOpinion(file.uid)
        .catch(() => {
          this.$message.error('删除失败')
        })
    }
  }
}
</script>

<style scoped lang="scss">

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
