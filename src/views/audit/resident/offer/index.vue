<!--
 * @Author: zfd
 * @Date: 2020-10-29 16:05:50
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-16 16:01:40
 * @Description: 报价列表
-->
<template>
  <div class="app-container" v-loading="listLoading">
    <div class="list-container">
      <div class="query-container">
        筛选项：
        <el-input v-model="query.name" placeholder="主体名称" size="small" />
        <el-input v-model="query.phone" placeholder="联系方式" size="small" />
        <el-input v-model="query.address" placeholder="地址" size="small" />
        <div>
          <el-button size="small" type="primary" @click="filterEntity">搜索</el-button>
          <el-button size="small" @click="clearQuery">重置</el-button>
        </div>

      </div>
      <div v-for="(s, index) in list" :key="index" class="list-item" @click="$router.push({name:'ResidentOfferDetail',params:{id:projectId,offerId:s.id,status}})">
        <div class="list-head">
          <div class="l-h-l">
            <span>{{ s.constructionUnit }}</span><span>{{ s.offerTime }}</span>
          </div>
        </div>
        <p><span>联系方式：{{ s.phoneNumber }}</span><span>报价（元）:{{ s.cost }}</span><span>施工周期（天）：{{ s.constructionPeriod }}</span></p>
        <p> 地址：{{ s.address }}</p>
      </div>
      <el-pagination style="margin-top:20px" background layout="prev, pager, next, total,sizes,jumper" hide-on-single-page :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    </div>

  </div>
</template>

<script>
import Construction from '@/api/construction'
import { notEmptyArray } from '@/utils'
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
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 10
      },
      list: [],
      listLoading: false,
      projectId:null,
      status:null
    }
  },
  created() {
    const { id, status } = this.$route.params
    // 8选择报价
    if (!isNaN(+id) && status == 8) {
      this.projectId = id
      this.status = status
      this.listOffers()
    }
  },
  methods: {
    async listOffers() {
      this.listLoading = true
      await Construction.listOffers(this.projectId,{ page: this.pagination.pageIndex - 1, size: this.pagination.pageSize }).then(res => {
        if (notEmptyArray(res.content)) {
          this.list = res.content
          this.pagination.total = res.totalElements
        }
      }).catch(err => {
        this.$message.error('数据获取失败')
        console.log(err)
      })
      this.listLoading = false
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
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.listOffers()
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
      this.listOffers()
    },
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 8选择报价
    if (isNaN(+id) || status != 8) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
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
