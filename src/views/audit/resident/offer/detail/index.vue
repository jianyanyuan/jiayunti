<!--
 * @Author: your name
 * @Date: 2020-10-14 10:12:06
 * @LastEditTime: 2020-12-17 09:40:40
 * @LastEditors: zfd
 * @Description: 居民查看报价单详情
 * @FilePath: \jiayunti\src\components\street\Pipe\index.vue
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-page-header content="施工报价" style="margin-bottom:50px" @back="$router.go(-1)" />

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
          <td>{{ construction.offerTime }}</td>
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
            <a v-for="file in construction.priceFileList" :key="file.name" class="file-display">
              <i class="el-icon-document" />
              {{ file.filename }}
              <i class="el-icon-download" style="float:right" />
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="confirm-container">
      <el-button type="success" @click="openModal">选择监理单位</el-button>
    </div>
    <el-dialog center title="选择监理单位" :visible.sync="superviseVisible" :close-on-click-modal="false">
      <el-radio-group v-model="supervisorId">
        <el-radio :label="s.id" v-for="(s, index) in supervisors" :key="index">
          <div class="list-item">
            <div class="list-head">
              <div class="l-h-l">
                <span>{{ s.supervisionName }}</span><span>联系方式：{{ s.phone }}</span>
              </div>
            </div>
            <p> 地址：{{ s.address }}</p>
          </div>
        </el-radio>

      </el-radio-group>

      <div class="confirm-container">
        <!-- <el-button @click="superviseVisible = false">取 消</el-button> -->
        <el-button type="success" @click="handlePost">选 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Construction from '@/api/construction'
import Supervision from '@/api/supervision'
import { notEmptyArray } from '@/utils'
import { advanceApi } from '@/api/projects'
export default {
  name: 'Offer',
  data() {
    return {
      supervisor: '',
      superviseVisible: false,
      construction: {
        priceFileList: []
      },
      offerId: null,
      projectId: null,
      status: null,
      supervisors: [],
      pageLoading: false,
      supervisorId: null
    }
  },
  computed: {

  },
  created() {
    const { id, offerId, status } = this.$route.params
    // 8选择报价
    if (!isNaN(+id) && status == 8 && !isNaN(+offerId)) {
      this.projectId = id
      this.status = status
      this.offerId = offerId
      this.getDetail()
    }
  },
  methods: {
    getDetail() {
      this.pageLoading = true
      Construction.detailOffer(this.offerId)
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
    openModal() {
      Supervision.list()
        .then(res => {
          this.supervisors = res
          this.superviseVisible = true
        })
        .catch(err => {
          console.log(err)
          this.$message.error('监理单位获取失败')
        })
    },
    async handlePost() {
      await advanceApi(this.projectId, this.status,this.construction.constructionId,this.supervisorId)
      .then(()=>{
        this.$router.push('/resident/list')
      })
      .catch(() => {
        this.$message.error('流程错误')
      })
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, offerId, status } = to.params
    // 8选择报价
    if (isNaN(+id) || status != 8 || isNaN(+offerId)) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  }
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
