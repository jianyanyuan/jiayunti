<!--
 * @Author: zfd
 * @Date: 2020-10-29 15:36:07
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 10:43:27
 * @Description:
-->
<template>
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
    <div v-for="(s, index) in source" :key="index" class="list-item" @click="$router.push({name:'ResidentArticle',params:{id:s.userId}})">
      <div class="list-head">
        <div class="l-h-l">
          <!-- <span>{{ s.time }}</span> -->
          <span>{{ s.name }}</span>
        </div>
      </div>
      <!-- 官网：<a :href="s.url" target="_blank" @click.stop="">{{ s.url }}</a> -->
      <p><span>联系方式：{{ s.phone }}</span></p>
      <p> 地址：{{ s.address }}</p>
    </div>
    <el-pagination style="margin-top:20px" background layout="prev, pager, next, total,sizes,jumper" :total="pagination.total" :page-size="pagination.pageSize" :page-sizes="[10,20,50]" :current-page.sync="pagination.pageIndex" @size-change="handleSizeChange" @current-change="handleCurrentPageChange" />
    <!-- <article>
      <article-show :info="source[current].detail || {}" class="article-container" />
    </article>
    <aside>
      <ul>
        <li v-for="(s, index) in source" :key="index" @click="current = index">
          <p>{{ s.name }}</p>
          <p>{{ s.address }}</p>
        </li>
      </ul>
    </aside> -->
  </div>
</template>

<script>
// import ArticleShow from '@/components/ArticleShow'
export default {
  name: 'ArticleList',
  props: {
    list: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      query: {
        name: '',
        phone: '',
        address: ''
      },
      pagination: {
        total: 0,
        pageIndex: 1,
        pageSize: 30
      },
      pageLoding: false,
      source: null
    }
  },
  created() {
    this.list(this, {})
  },
  methods: {
    filterEntity() {
      this.list(this, this.query)
    },
    clearQuery() {
      this.query = {}
      this.list(this, this.query)
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.list(this, this.query)
    },
    handleCurrentPageChange(val) {
      this.pagination.pageIndex = val
      this.list(this, this.query)
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
    ::v-deep .el-input--small {
      width: 200px;
      margin-right: 20px;
    }
  }
  // .query-container {
  //   display: flex;
  //   flex-flow: row nowrap;
  //   justify-content: space-between;
  //   align-items: center;
  //   border-bottom: 1px dashed #409eff;
  //    margin-bottom: 30px;
  // }
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
