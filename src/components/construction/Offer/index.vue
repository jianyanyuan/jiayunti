<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-10-26 10:41:02
 * @LastEditors: zfd
 * @Description: 施工报价
 * @FilePath: \jiayunti\src\components\street\Pipe\index.vue
-->
<template>
  <div class="app-container">
    <el-row type="flex" justify="space-between" align="middle">
      <span>基本资料</span>
      <el-button type="primary" style="float:right" @click="editable = !editable">{{ editable ? '修改' : '保存' }}</el-button>
    </el-row>

    <!-- 展示 -->
    <div v-if="!editable">
      <table class="input-form">
        <thead>
          <tr>
            施工报价单
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>施工单位</td>
            <td>{{ construction.name }}</td>
            <td>联系人</td>
            <td>{{ construction.contacts }}</td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>{{ construction.phone }}</td>
            <td>地址</td>
            <td>{{ construction.address }}</td>

          </tr>
          <tr>
            <td>报价时间</td>
            <td>{{ construction.time }}</td>
            <td>施工周期（天）</td>
            <td>{{ construction.dayCount }}</td>
          </tr>
          <tr v-for="(item,index) in construction.projects" :key="index">
            <td>项目</td>
            <td>{{ item.name }}</td>
            <td>金额</td>
            <td>{{ item.price }}</td>
          </tr>
          <tr>
            <td>材料</td>
            <td colspan="3">
              <p v-for="file in fileList" :key="file.name">
                <i class="el-icon-document" />
                {{ file.name }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 填写 -->
    <div v-else>
      <table class="input-form">
        <thead>
          <tr>施工报价单</tr>
        </thead>
        <tbody>
          <tr>
            <td>施工单位</td>
            <td>
              <el-input v-model="construction.name" />
            </td>
            <td>联系人</td>
            <td>
              <el-input v-model="construction.contacts" />
            </td>
          </tr>
          <tr>
            <td>联系电话</td>
            <td>
              <el-input v-model="construction.phone" />
            </td>
            <td>地址</td>
            <td>
              <el-input v-model="construction.address" />
            </td>
          </tr>
          <tr>

            <td>报价时间</td>
            <td>
              <el-date-picker v-model="construction.time" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" />
            </td>
            <td>施工周期（天）</td>
            <td>{{ construction.dayCount }}</td>
          </tr>
          <tr v-for="(item,index) in construction.projects" :key="index">
            <td>项目</td>
            <td>
              {{ item.name }}
            </td>
            <td>金额（元）</td>
            <td>
              <el-input v-model="item.price" />
            </td>
          </tr>
          <tr>
            <td>材料</td>
            <td colspan="3">
              <el-upload action="#" :on-remove="handleUploadRemove" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" drag multiple :auto-upload="false">
                <!-- <i class="el-icon-upload" /> -->
                <div>将文件拖到此处，或点击添加</div>
                <p>单个文件大小不超过20MB，可上传图片或PDF</p>
              </el-upload>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Resident',
  data() {
    return {
      editable: false,
      construction: {
        name: '',
        address: '',
        phone: '',
        contracts: '',
        time: '',
        dayCount: '',
        projects: [
          {
            name: '人工费',
            price: ''
          },
          {
            name: '材料费',
            price: ''
          }
        ]

      }

    }
  },
  computed: {

  },
  created() {

  },
  methods: {

    handleUploadRemove(file, fileList) {
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
    }
  }
}
</script>

<style scoped lang="scss">
.input-form {
  position: relative;
  width: 90%;
  min-width: 1220px;
  border-collapse: collapse;
  border: 1px solid #aaa;
  thead {
    // width: 100%;
    background-color: #f1f1f1;
    border: 1px solid #aaa;
  }
  th,
  tr {
    height: 33px;
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
</style>
