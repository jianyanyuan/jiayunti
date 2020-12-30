<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-12-30 09:32:27
 * @LastEditors: zfd
 * @Description: 居民查看报价单详情
 * @FilePath: \jiayunti\src\components\street\Pipe\index.vue
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-page-header content="报价单" style="margin-bottom:50px" @back="$router.go(-1)" />

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
            <router-link :to="{ name: 'user', params: { userId: 123 }}">{{ construction.constructionUnit }}</router-link>
          </td>
          <td>联系人</td>
          <td>{{ construction.contact }}</td>
        </tr>
        <tr>
          <td>联系电话</td>
          <td>{{ construction.phoneNumber }}</td>
          <td>地址</td>
          <td>{{ construction.address }}</td>

        </tr>
        <tr>
          <td>报价时间</td>
          <td>{{ construction.offerTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
          <td>施工周期（天）</td>
          <td>{{ construction.constructionPeriod }}</td>
        </tr>
        <tr>
          <td rowspan="2">项目（元）</td>
          <td>人工费</td>
          <td colspan="2">
            {{construction.artificialCost}}
          </td>
        </tr>
        <tr>
          <td>材料费</td>
          <td colspan="2">
            {{construction.materialCost}}
          </td>
        </tr>
        <tr>
          <td>材料</td>
          <td colspan="3" style="text-align:left">
            <a v-for="file in construction.priceFileList" :key="file.name" class="file-display" @click="download(file)">
              <i class="el-icon-document" />
              {{ file.filename }}
              <i class="el-icon-download" style="float:right" />
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Construction from '@/api/construction'
export default {
  name: 'Offer',
  data() {
    return {
      construction: {
        priceFileList: []
      },
      projectId: null,
      pageLoading: false,
    }
  },
  computed: {

  },
  created() {
    const { id } = this.$route.params
    if (!isNaN(+id)) {
      this.projectId = id
      this.getDetail()
    }
  },
  methods: {
    getDetail() {
      this.pageLoading = true
      Construction.getProOffer(this.projectId)
        .then(res => {
          this.construction = res
        })
        .catch(err => {
          console.log(err)
          this.$message.error('报价获取失败')
        })
        .finally(() => {
          this.pageLoading = false
        })
    },
    download(file) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', file.path, true);
      xhr.responseType = "blob";    // 返回类型blob
      xhr.onload = function () {
        if (this.status === 200) {
          var blob = this.response;// 获取返回值
          var a = document.createElement('a');
          a.download = file.filename;
          a.href = window.URL.createObjectURL(blob);
          a.click();
        }
      };
      // 发送ajax请求
      xhr.send();
    }

  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id } = to.params
    if (isNaN(+id)) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  },

}
</script>

<style scoped lang="scss">
.input-form {
  position: relative;
  width: 90%;
  margin: 0 auto;
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

.confirm-container {
  margin-top: 30px;
  text-align: center;
}
a:hover {
  color: cornflowerblue;
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
.list-item {
  // height: 200px;
  border: 1px solid #e5e5ee;
  padding: 10px 8px;
  // margin-bottom: 20px;
  .list-head {
    .l-h-l {
      span:nth-of-type(1) {
        color: #625261;
        font-weight: bold;
        margin-right: 40px;
      }
      span:last-of-type {
        color: #a6a6a4;
        font-size: 12px;
      }
    }
  }
  p {
    font-size: 14px;
    color: #000;
    span {
      margin-right: 40px;
    }
  }
}
.app-container ::v-deep .el-radio-group {
  width: 100%;
  .el-radio {
    display: flex;
    align-items: center;
    margin: 0 0 20px;
    .el-radio__label {
      flex: 1;
    }
  }
}
</style>
