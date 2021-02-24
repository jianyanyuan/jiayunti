<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-12-31 13:46:30
 * @LastEditors: zfd
 * @Description: 施工报价
 * @FilePath: \jiayunti\src\components\street\Pipe\index.vue
-->
<template>
  <div class="app-container">
    <p>施工报价</p>

    <!-- 展示 -->
    <table class="input-form">
      <thead>
        <tr>
          <td colspan="4">施 工 报 价 单</td>
        </tr>
      </thead>
      <tbody>

        <tr>
          <td>施工单位</td>
          <td>
            <el-input v-model="construction.constructionUnit" placeholder="请输入单位名" />
          </td>
          <td>联系人</td>
          <td>
            <el-input v-model="construction.contact" placeholder="请输入联系人" />
          </td>
        </tr>
        <tr>
          <td>联系电话</td>
          <td>
            <el-input v-model="construction.phoneNumber" placeholder="请输入联系电话" />
          </td>
          <td>地址</td>
          <td>
            <el-input v-model="construction.address" placeholder="请输入联系地址" />
          </td>
        </tr>
        <tr>
          <td>报价时间</td>
          <td>
            <el-date-picker v-model="construction.offerTime" placeholder="请选择报价时间" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" />
          </td>
          <td>施工周期（天）</td>
          <td>
            <el-input-number v-model="construction.constructionPeriod" placeholder="请选择施工周期" controls-position="right" />
          </td>
        </tr>
        <tr>
          <td>项目报价（元）</td>

          <td colspan="3">
            <el-input-number v-model="construction.cost" :precision="2" :step="0.1" placeholder="请输入项目报价" controls-position="right" />
          </td>
        </tr>

        <tr>
          <td>材料</td>
          <td colspan="3" style="padding-top:20px">
            <el-upload action="#" :on-remove="handleUploadRemove" :on-change="handleUploadChange" :auto-upload="false">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">单个文件大小不超过20M</div>
            </el-upload>
          </td>
        </tr>

      </tbody>

    </table>

    <div style="text-align:center;margin-top:30px">
      <el-button type="primary" icon="el-icon-arrow-left" @click.native.prevent="nextProcess(-1)">上一步</el-button>
      <el-button type="success" icon="el-icon-upload2" @click.native.prevent="postApply">提 交</el-button>
    </div>
  </div>
</template>

<script>
import { plainToClass } from 'class-transformer'
import { validateSync } from 'class-validator'
import { Construction } from './class'
import Api from '@/api/construction'
import File from '@/api/file'
import { notEmptyArray } from '@/utils'
export default {
  name: 'ConstructionOffer',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    status: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      construction: {
        constructionUnit: this.$store.getters.username,
        address: '',
        phoneNumber: '',
        contact: '',
        offerTime: '',
        constructionPeriod: 0,
        cost: 0
      },
      uploadList: [], // 上传用
      pageLoading: false,
      typeName: 'offer-material'
    }
  },
  computed: {

  },
  created() {
  },
  methods: {
    nextProcess(arrow) {
      this.$emit('nextProcess', arrow)
    },

    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    // 限制了添加文件的逻辑，不支持多个文件选择
    handleUploadChange(file, fileList) {
      const valid = this.checkUpload(file.raw)
      if (valid && file.url === undefined) {
        const formData = new FormData()
        formData.append('file', file.raw)
        this.uploadList.push({
          uid: file.uid,
          name: file.name,
          file: formData
        })
      } else {
        fileList.pop()
      }
    },
    checkUpload(file) {
      if (!file.size) {
        this.$message.error('上传为空！')
        return false
      }
      const isBig = file.size <= 1024 * 1024 * 20 // 单个文件最大20M
      if (!isBig) {
        this.$message.error('图片大小不能超过20MB！')
        return false
      }
      return true
    },
    // 删除文件
    handleUploadRemove(file, fileList) {
      // 未上传 --> 取消上传
      const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
      this.uploadList.splice(removeIdx, 1)
    },
    // 提交材料
    async postApply() {
      const data = plainToClass(Construction, this.construction)
      const errors = validateSync(data)
      if (errors.length > 0) {
        const { constraints } = errors[0]
        this.$message.error(Object.values(constraints)[0])
        return
      }
      this.pageLoading = true
      const offerRes = await Api.addOffer(this.id, this.construction)
      const { id } = offerRes // 报价id
      if (id) {
        let error = false
        if (notEmptyArray(this.uploadList)) {
          for (const idx in this.uploadList) {
            const { file } = this.uploadList[idx]
            await File.uploadOffer(id, file)
              .catch(() => {
                // 上传失败
                error = true
              })
          }
        }
        this.uploadList = []
        this.pageLoading = false
        if (error) {
          this.$message.error('材料上传失败')
          return
        }
        this.$router.push('/construction/list')
      } else {
        this.$message.error('提交失败')
        this.pageLoading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.upload-container {
  position: absolute;
  padding: 0 20px;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.input-form {
  position: relative;
  width: 90%;
  // min-width: 1220px;
  border-collapse: collapse;
  border: 1px solid #aaa;
  thead {
    // width: 100%;
    background-color: #f1f1f1;
    border: 1px solid #aaa;
  }
  th,
  tr {
    height: 45px;
    border: 1px solid #aaa;
  }
  td,
  th {
    text-align: center;
    vertical-align: middle;
    border: 1px solid #aaa;
  }
}

.input-form ::v-deep {
  .el-input__inner,
  .el-input-number,
  .el-select {
    border: none;
    width: 100%;
  }
  .el-date-editor .el-range-input,
  .el-date-editor .el-range-separator {
    margin: 4px;
  }
}

.file-display {
  display: block;
  text-align: left;
  padding: 5px;
  margin: 10px;
  border-radius: 5px;
  // background-color: chartreuse;
}
.file-display:hover {
  color: #409eff;
  background-color: #ebebeb;
}
</style>
