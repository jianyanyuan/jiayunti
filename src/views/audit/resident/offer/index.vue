<!--
 * @Author: zfd
 * @Date: 2020-10-29 16:05:50
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-02 08:31:46
 * @Description: 报价列表
-->
<template>
  <div class="app-container">
    <div class="list-container">
      <div class="query-container">
        筛选项：
        <el-input v-model="query.name" placeholder="主体名称" size="small" />
        <el-input v-model="query.phone" placeholder="联系方式" size="small" />
        <el-input v-model="query.address" placeholder="地址" size="small" />
        <div>
          <el-button size="small" @click="filterEntity">搜索</el-button>
          <el-button size="small" type="primary" @click="clearQuery">重置</el-button>
        </div>

      </div>
      <div v-for="(s, index) in source" :key="index" class="list-item" @click="$router.push({name:'ResidentOfferDetail',params:{detail}})">
        <div class="list-head">
          <div class="l-h-l">
            <span>{{ s.name }}</span><span>{{ s.time }}</span>
          </div>
        </div>
        <p><span>联系方式：{{ s.phone }}</span><span>报价（元）:{{ s.amount }}</span><span>施工周期（天）：{{ s.dayCount }}</span></p>
        <p> 地址：{{ s.address }}</p>
      </div>
      <el-pagination background layout="prev, pager, next" :total="total" hide-on-single-page :page-size="10" :pager-count="7" :current-page.sync="query.pi" @current-change="handleCurrentChange" />
    </div>

  </div>
</template>

<script>
export default {
  name: 'OfferList',
  components: {},
  data() {
    return {
      query: {
        name: '',
        phone: '',
        address: '',
        pi: 1
      },
      total: 100,
      source: [
        {
          name: '施工单位',
          time: '2020-10-29 10:20:04',
          phone: '15988800323',
          amount: '1000',
          dayCount: '10',
          address: '中国江苏省南京市玄武区珠江路687号2幢'
        },
        {
          name: '施工单位111',
          time: '2020-10-29 10:20:04',
          phone: '15988800323',
          amount: '1000',
          dayCount: '10',
          address: '中国江苏省南京市玄武区珠江路687号2幢'
        }
      ]
    }
  },
  created() {

  },
  methods: {
    getEntites() {

    },
    filterEntity() {
      this.getEntites()
    },
    clearQuery() {
      this.query = {
        name: '',
        phone: '',
        address: '',
        pi: 1
      }
      this.getEntites()
    },
    handleCurrentChange(value) {
      this.query.pi = value
      this.getEntites()
    }
  }
}
</script>
<style lang="scss" scoped>
.list-container {
  display: flex;
  flex-flow: column nowrap;
  a:hover {
    color: #008891;
  }
  .query-container {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    margin: 0 0 30px !important;
    padding: 0 0 10px;
    font-size: 14px;
    color: #14274e;
    border-bottom: 1px dashed #9ba4b4;
    &::v-deep .el-input--small {
      width: 200px;
      margin-right: 20px;
    }
  }

  .list-item:hover {
    border: 1px solid gray;
  }
  .list-item {
    // height: 200px;
    border: 1px solid #e5e5ee;
    padding: 10px 8px;
    margin-bottom: 20px;
    cursor: pointer;
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
}
</style>
