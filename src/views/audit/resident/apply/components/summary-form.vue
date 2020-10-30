<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-30 14:42:43
 * @Description: 居民申请意见汇总表
-->
<template>
  <div>
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>意见征询汇总表</span>
      <el-button v-if="hasChanged" type="primary" style="float:right" @click="hasChanged = !hasChanged">修改</el-button>
      <el-button v-else type="primary" style="float:right" @click="hasChanged = !hasChanged">保存</el-button>
    </el-row>
    <template v-if="hasChanged">
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>查看</span>
        </div>
        <upload-list :files="urls" list-type="picture-card" :disabled="true" :handle-preview="detailImg" />

      </el-card>
      <div style="text-align:center">
        <el-button type="primary" icon="el-icon-arrow-left" @click.native.prevent="nextProcess(-1)">上一步</el-button>

        <el-button type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>

      </div>
    </template>

    <template v-else>
      <el-card class="upload-card" style="margin-bottom:30px">
        <div slot="header">
          <span>上传</span>
        </div>
        <el-upload action="#" :on-remove="handleUploadRemove" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" list-type="picture" drag multiple :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
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
// import { deepClone } from '@/utils'

export default {
  name: 'SummaryForm',
  data() {
    return {
      // 修改后重新保存
      imgVisible: false,
      detailImgUrl: '',
      hasChanged: false,
      formLoading: false,
      rooms: ['401', '402', '403'],
      model: [],
      urls: [
        {
          name: '身份证',
          uid: '3302e58f9a181d2509f3dc0fa68b0jpeg',
          url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
        },
        {
          name: '身份证',
          uid: '781c4fba33d8jpeg',
          url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
        }
      ],
      test: [
        [{ name: '身份证', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg' }],
        [{ name: '身份证', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg' }],
        [{ name: '身份证', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg' }]],
      uploadFile: null
    }
  },

  computed: {
  },
  watch: {

  },
  created() {
    console.log(11111)
  },
  methods: {
    handleUploadRemove(file, fileList) {
    },
    // handleUploadChange(file, fileList) {
    //   console.log(file)
    //   console.log(fileList)
    //   debugger
    // },
    nextProcess(arrow) {
      this.$emit('nextProcess', arrow)
    },
    // 上传文件发生改变时
    handleUploadChange(file, fileList, index) {
      if (fileList.length > 0) {
        this.model[index] = fileList.map(f => f.raw)
      }
    },
    detailImg(file) {
      this.detailImgUrl = file.url
      this.imgVisible = true
    },
    // 图片上传之前判断
    uploadBefore(file) {
      const isImage = file.type.indexOf('image') !== -1
      const isBig = file.size <= 1024 * 1024 * 10
      if (!file) {
        this.$message.error('上传为空！')
        return false
      }
      if (!isImage) {
        this.$message.error('只能上传图片！')
        return false
      }
      if (!isBig) {
        this.$message.error('图片大小不能超过10MB！')
        return false
      }
      return true
    },

    // 添加投注单
    addBet() {
      if (!this.uploadFile) {
        this.$message.error('请上传附件')
        this.formLoading = false
        return false
      }
      if (!this.uploadBefore(this.uploadFile)) {
        this.formLoading = false
        return false
      }
      const formData = new FormData()
      formData.append('file', this.uploadFile)
      // 上传附件
      File.upload(formData, { desciption: 'sssss' }).then(res => {
        debugger
      }).catch(err => {
        this.$message.error(err)
      })

      // }
    },

    // 更新投注单
    postApply() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.plot.length === 0) {
            this.$message.error('请选择地址')
            return false
          }
          this.formLoading = true
          this.form.address = this.form.address.concat(this.plot)
          this.form.rooms = this.form.rooms.map(v => v.val)
          this.formLoading = false
          console.log(this.form)
        } else {
          this.$message.error('请补全信息')
        }
      })
    }
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
  li{
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
.image-container{
  height: 200px;
  margin-bottom: 20px;
  img{
    width: auto;
    height: auto;

    max-width: 100%;
    max-height: 100%;
  }
}
</style>
