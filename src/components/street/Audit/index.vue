<!--
 * @Author: zfd
 * @Date: 2020-10-16 16:35:29
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-22 16:22:29
 * @Description:
-->
<template>
  <div>
    <div>
      <p>审核意见：</p>
      <el-input v-model="audit" type="textarea" :rows="4" />
      <el-upload action="#" :on-remove="handleUploadRemove" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" list-type="picture" drag multiple :auto-upload="false">
        <!-- <i class="el-icon-upload" /> -->
        <div class="enclosure-tips">
          初步审核意见表
        </div>
        <div>将文件拖到此处，或点击添加</div>
        <p>单个文件大小不超过20MB，可上传图片或PDF</p>
      </el-upload>
    </div>
    <div class="audit-operation">
      <el-button type="danger">否决</el-button>
      <el-button type="success">通过</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Resident',
  data() {
    return {
      audit: ''
    }
  },
  methods: {
    handleUploadRemove() {},
    handleUploadChange() {}
  }
}
</script>

<style scoped>
.enclosure-tips {
  color: #14274e;
text-align: left;

}
.audit-operation {
  width: 200px;
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}
</style>
