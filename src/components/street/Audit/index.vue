<!--
 * @Author: zfd
 * @Date: 2020-10-16 16:35:29
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-03 09:08:29
 * @Description:
-->
<template>
  <div>
    <el-form label-width="120px" :model="form" :rules="rule">
      <el-form-item label="审核意见:" prop="audit">
        <el-input v-model="form.audit" type="textarea" :rows="4" />
      </el-form-item>
      <el-form-item label="审核表:" prop="attachment">
        <el-upload action="#" class="form-card" :on-remove="handleUploadRemove" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" list-type="picture" drag multiple :auto-upload="false">
          <!-- <i class="el-icon-upload" /> -->
          <div class="enclosure-tips">
            审核意见表
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
      <el-form-item class="audit-operation">
        <el-button type="success" size="medium" icon="el-icon-upload2">提 交</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
export default {
  name: 'Resident',
  props: {
    params: {
      type: Object,
      default: {},
      required: true
    }
  },
  data() {
    return {
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
      resultOptions: [
        { key: 0, val: '通过' },
        { key: -1, val: '不通过' }
      ]
    }
  },
  methods: {
    handleUploadRemove() { },
    handleUploadChange() { }
  }
}
</script>

<style scoped>
.enclosure-tips {
  color: #14274e;
  text-align: left;
}
.audit-operation {
  margin-top: 50px;
}
.form-card ::v-deep .el-upload-dragger {
  width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
.enclosure-tips {
  color: #14274e;
  text-align: center;
}
</style>
