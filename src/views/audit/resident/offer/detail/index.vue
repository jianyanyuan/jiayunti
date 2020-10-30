<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-10-30 16:35:21
 * @LastEditors: zfd
 * @Description: 居民查看报价单详情
 * @FilePath: \jiayunti\src\components\street\Pipe\index.vue
-->
<template>
  <div class="app-container">
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
          <td colspan="3" style="text-align:left">
            <upload-list :files="fileList" list-type="" :disabled="true" :handle-preview="downloadFile" class="upload-list" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Offer',
  data() {
    return {
      fileList: [{ name: '123213', url: '', uid: 'dsdsd' }, { name: '456465', url: '', uid: 'dsadsd' }, { name: '789798', url: '', uid: 'sdasdasdasd' }],
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
    downloadFile(file) {

    }
  }
}
</script>

<style scoped lang="scss">

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

.upload-list{
  &::after{
    content: "\e77c";
  }
}
</style>
