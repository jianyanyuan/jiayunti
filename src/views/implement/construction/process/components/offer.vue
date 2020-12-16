<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-12-16 15:26:06
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
            <el-input v-model="construction.constructionUnit" placeholder="请输入施工单位" auto-complete="false" />
          </td>
          <td>联系人</td>
          <td>
            <el-input v-model="construction.contact" placeholder="请输入联系人" auto-complete="false" />
          </td>
        </tr>
        <tr>
          <td>联系电话</td>
          <td>
            <el-input v-model="construction.phoneNumber" placeholder="请输入联系电话" auto-complete="false" />
          </td>
          <td>地址</td>
          <td>
            <el-input v-model="construction.address" placeholder="请输入联系地址" auto-complete="false" />
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
          <td rowspan="2">项目（元）</td>
          <td>人工费</td>
          <td colspan="2">
            <el-input-number v-model="construction.artificialCost" :precision="2" :step="0.1" placeholder="请输入人工费" controls-position="right" />
          </td>
        </tr>
        <tr>
          <td>材料费</td>
          <td colspan="2">
            <el-input-number v-model="construction.materialCost" :precision="2" :step="0.1" placeholder="请输入材料费" controls-position="right" />
          </td>
        </tr>
        <tr>
          <td>材料</td>
          <td colspan="3" style="padding-top:20px">

            <el-upload action="#" :on-remove="handleUploadRemove" :on-change="handleUploadChange" :auto-upload="false">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
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
        constructionUnit: '南通一建',
        address: '江苏省',
        phoneNumber: '15988800323',
        contact: '蒋一帆',
        offerTime: '',
        constructionPeriod: '10',
        materialCost: '100',
        artificialCost: '100'
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
      const removeIdx = this.uploadList.findIndex(f => f.uid === file.uid)
      this.uploadList.splice(removeIdx, 1)
    },
    // 提交材料
    async postApply() {
      const data = plainToClass(Construction, this.construction)
      const errors = validateSync(data)
      if (errors.length > 0) {
        this.$message.error('请补全信息')
        return
      }
      this.pageLoading = true
      const offerRes = await Api.addOffer(this.id, this.construction)
      const { id } = offerRes
      if (id) {
        let error = false
        if (notEmptyArray(this.uploadList)) {
          this.uploadList.forEach(async (v, i) => {
            const { projectId, file } = v
            await File.upload(file, { projectId, typeName: this.typeName })
              .catch(() => {
                // 上传失败
                error = true
              })
            this.uploadList.splice(i, 1)
          })
        }
        if (error) {
          this.$message.error('提交失败')
        }
        this.pageLoading = false
        this.$router.push('/construction/list')
      } else {
        this.$message.error('提交失败')
        this.pageLoading = false
      }
    },
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
