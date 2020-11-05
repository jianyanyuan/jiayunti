<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-11-02 13:22:16
 * @LastEditors: zfd
 * @Description: 施工报价
 * @FilePath: \jiayunti\src\components\street\Pipe\index.vue
-->
<template>
  <div class="app-container">
    <el-row type="flex" justify="end" align="middle">
      <!-- <span>基本资料</span> -->
      <el-button type="primary" style="float:right" @click="editable = !editable">{{ editable ? '保 存' : '修 改' }}</el-button>
    </el-row>

    <!-- 展示 -->
    <div v-if="!editable">
      <table class="input-form">
        <thead>
          <tr>
            <td colspan="4">施 工 报 价 单</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>施工单位</td>
            <td>{{ construction.name }}</td>
            <td>联系人</td>
            <td>{{ construction.contracts }}</td>
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
          <tr>
            <td :rowspan="construction.projects.length">项目（元）</td>
            <td>{{ construction.projects[0].name }}</td>
            <td colspan="2">{{ construction.projects[0].price }}</td>

          </tr>
          <tr v-for="(item,index) in construction.projects.slice(1)" :key="index">
            <td>{{ item.name }}</td>
            <td colspan="2">{{ item.price }}</td>
          </tr>
          <tr>
            <td>材料</td>
            <td colspan="3">
              <a v-for="file in fileList" :key="file.name" class="file-display">
                <i class="el-icon-document" />
                {{ file.name }}
                <i class="el-icon-download" style="float:right" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <div style="text-align:center;margin-top:30px">
        <el-button type="primary" icon="el-icon-arrow-left" @click.native.prevent="nextProcess(-1)">上一步</el-button>
        <el-button type="success" icon="el-icon-upload2" @click.native.prevent="postOffer">提 交</el-button>
        <!-- <el-button type="primary" icon="el-icon-arrow-left" @click.native.prevent="nextProcess(-1)">上一步</el-button>

        <el-button type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button> -->

      </div>
    </div>

    <!-- 填写 -->
    <div v-else>
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
              <el-input v-model="construction.name" />
            </td>
            <td>联系人</td>
            <td>
              <el-input v-model="construction.contracts" />
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
            <td>
              <el-input v-model="construction.dayCount" />
            </td>
          </tr>
          <tr>
            <td :rowspan="construction.projects.length">项目（元）</td>
            <td>{{ construction.projects[0].name }}</td>
            <td colspan="2">
              <el-input v-model="construction.projects[0].price" />
            </td>

          </tr>
          <tr v-for="(item,index) in construction.projects.slice(1)" :key="index">
            <td>{{ item.name }}</td>
            <td colspan="2">
              <el-input v-model="item.price" />
            </td>
          </tr>

          <tr>
            <td>材料</td>
            <td colspan="3" style="position:relative">

              <el-upload action="#" :on-remove="handleUploadRemove" :on-change="function(file,fileList){return handleUploadChange(file,fileList,index)}" multiple :auto-upload="false">
                <!-- <i class="el-icon-upload" /> -->
                <div class="upload-container">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <span>支持文件格式：pdf、word、excel、txt</span>
                </div>
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
  name: 'Basic',
  data() {
    return {
      editable: false,
      fileList: [{ name: '123213' }, { name: '456465' }, { name: '789798' }],
      construction: {
        name: '中一建',
        address: '中一建中一建',
        phone: '15988800323',
        contracts: '中一建',
        time: '2020-10-12 15-：48',
        dayCount: '3',
        projects: [
          {
            name: '人工费',
            price: '10000'
          },
          {
            name: '材料费',
            price: '100000'
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
    postOffer() {

    },
    nextProcess(arrow) {
      this.$emit('nextProcess', arrow)
    },
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
