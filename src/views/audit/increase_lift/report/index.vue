<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-27 09:38:53
 * @Description: 增梯办联合审查报告
-->
<template>
  <div class="app-container">
    <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <el-form label-width="120px" class="show-form">
          <el-form-item label="姓名">
            {{ basic.name }}
          </el-form-item>
          <el-form-item label="详细地址">
            <el-cascader v-model="basic.address" :options="addressOptions" />
            <label for="address-detail" class="label-detail"> — </label>
            <el-cascader v-model="plot" :options="plotOptions" />
          </el-form-item>
          <el-form-item label="电话">
            {{ basic.phone }}
          </el-form-item>
          <el-form-item label="加装电梯地址">
            {{ basic.liftAddress }}
          </el-form-item>
          <el-form-item label="设计单位">
            {{ basic.company }}
          </el-form-item>
          <el-form-item label="设备">
            {{ basic.spec }}
          </el-form-item>
        </el-form>

      </el-card>
    </div>
    <el-card style="margin-bottom:30px">
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>联合审批报告</span>
          <el-button v-if="!hasChanged" type="primary" style="float:right" @click="hasChanged = !hasChanged">保 存</el-button>
          <el-button v-else type="primary" style="float:right" @click="hasChanged = !hasChanged">修 改</el-button>
        </el-row>
      </div>
      <template v-if="hasChanged" class="upload-card">

        <el-form label-width="120px">
          <el-form-item label="审核意见:">
            {{ form.audit }}
          </el-form-item>
          <el-form-item label="报告:">
            <image-card url="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" @show="showPic" />
          </el-form-item>
          <el-form-item label="审核结果:">
            {{ form.result }}
          </el-form-item>
        </el-form>
      </template>

      <template v-else>
        <el-form label-width="120px" :model="form" :rules="rule">
          <el-form-item label="审核意见:" prop="audit">
            <el-input v-model="form.audit" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item label="报告:" prop="attachment">
            <el-upload action="#" class="form-card" :on-remove="handleUploadRemove" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" list-type="picture" drag multiple :auto-upload="false">
              <!-- <i class="el-icon-upload" /> -->
              <div class="enclosure-tips">
                联合审查报告
              </div>
              <div>将文件拖到此处，或点击添加</div>
              <div>单个文件大小不超过20MB，可上传图片或PDF</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="审核结果:" prop="result">
            <el-select v-model="form.result">
              <el-option v-for="item in resultOptions" :key="item.val" :value="item.key" :label="item.val" />
            </el-select>
          </el-form-item>
        </el-form>

      </template>
    </el-card>
    <el-dialog :visible.sync="picShow" class="dialog-image">
      <img src="https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg" alt="">
    </el-dialog>
  </div>
</template>

<script>
import * as File from '@/api/file'
// import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'
import ImageCard from '@/components/Imagecard'
export default {
  name: 'ConsultationForm',
  components: {
    ImageCard
  },
  data() {
    return {
      picShow: false,
      // 修改后重新保存
      hasChanged: false,
      formLoading: false,
      rooms: ['401', '402', '403'],
      form: {
        audit: '的撒打算',
        attachment: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        result: 0
      },
      rule: {
        audit: [{ required: true, message: '请给出审核意见', trigger: 'blur' }],
        attachment: [{ required: true, message: '请上传报告', trigger: 'blur' }],
        result: [{ required: true, message: '请给出审核结果', trigger: 'blur' }]
      },
      basic: {
        name: '李先生',
        address: ['jiangsu', 'suzhou', 'gusu', 'canglang', 'shequ', 'xiaoqu'],
        phone: '15988800323',
        liftAddress: '小区1楼',
        company: '苏州建研院',
        spec: '高端电梯'
      },
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
      ],
      test: [
        [{ name: '身份证', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg' }],
        [{ name: '身份证', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg' }],
        [{ name: '身份证', url: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg' }]],
      uploadFile: null,
      resultOptions: [
        { key: 0, val: '通过' },
        { key: -1, val: '不通过' }
      ]
    }
  },

  computed: {
    ...mapGetters('common', ['addressOptions', 'plotOptions'])
  },
  watch: {

  },
  created() {
    this.plot = this.basic.address.slice(3)

    this.basic.address = this.basic.address.slice(0, 3)
  },
  methods: {
    showPic() {
      this.picShow = true
    },
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

    // 提交申请
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
.basic-container ::v-deep .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}
.enclosure-tips {
  color: #14274e;
  text-align: center;
}
.show-form ::v-deep {
  .el-cascader,
  .el-input__suffix-inner {
    pointer-events: none;
    cursor: default;
    opacity: 0.8;
  }
}
.upload-card {
  text-align: center;
  margin-bottom: 30px;
}

.form-card ::v-deep .el-upload-dragger {
  width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
.image-container {
  text-align: center;
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
