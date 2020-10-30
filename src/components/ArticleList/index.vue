<!--
 * @Author: zfd
 * @Date: 2020-10-29 15:36:07
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-30 16:10:06
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
        <el-button size="small" @click="filterEntity">搜索</el-button>
        <el-button size="small" type="primary" @click="clearQuery">重置</el-button>
      </div>

    </div>
    <div v-for="(s, index) in source" :key="index" class="list-item" @click="$router.push({name:'ResidentArticle',params:{detail}})">
      <div class="list-head">
        <div class="l-h-l">
          <span>{{ s.name }}</span><span>{{ s.time }}</span>
        </div>
      </div>
      <p><span>联系方式：{{ s.phone }}</span>官网：<a :href="s.url" target="_blank" @click.stop="">{{ s.url }}</a></p>
      <p> 地址：{{ s.address }}</p>
    </div>
    <el-pagination background layout="prev, pager, next" :total="total" hide-on-single-page :page-size="10" :pager-count="7" :current-page.sync="query.pi" @current-change="handleCurrentChange" />
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
  components: {
  },
  props: {
    source: {
      type: Array,
      required: true,
      validator: function(value) {
        return value.length > 0
      }
    },
    total: {
      type: [Number, String],
      required: true,
      validator: function(value) {
        return isFinite(+value) && +value > 0
      }
    }
  },
  data() {
    return {
      query: {
        name: '',
        phone: '',
        address: '',
        pi: 1
      },
      detail: {
        name: '东莞市六田精密电子有限公司',
        source: '东莞市六田精密电子有限',
        date: '2019-01-15 18:11',
        phone: '15988800323',
        address: '中国江苏省南京市玄武区珠江路687号2幢',
        author: '非尔思科技',
        desc: '<p><span style=\"color: rgb(68, 68, 68); font-family: 微软雅黑, Arial; background-color: rgb(255, 255, 255);\">东莞市六田精密电子有限公司成立于2010年5月，是一家专业设计制造精密五金冲压模具、生产精密端子、外壳、精密弹片等精密五金冲压件，模具工装件的五金冲压厂家。产品广泛应用于移动电脑设备，数位相机，行动通讯设备、汽车/航空/航海电子零组件，医疗电子、智能家电、IC、3C产品及户外防水等领域。</span></p><p style="text-align:center"><img src=\"http://www.szfec.cn/uploads/190109/1-1Z109160005K3.jpg\" alt=\"东莞市六田精密电子有限公司\"/></p>',
        link: 'http://www.szfec.cn/case/qiyewangzhananli/9.html'
      }
    }
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
  .list-item:hover{
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
