<!--
 * @Author: zfd
 * @Date: 2020-10-29 15:46:07
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-30 11:22:40
 * @Description:
-->
<template>
  <div class="app-container">
    <el-page-header content="详情页面" @back="$router.go(-1)" />
    <div class="intro-container">
      <header>
        <h1>{{ info.name }}</h1>
        <p>来源：<span>{{ info.source }}</span>日期：<span>{{ info.date }}</span><span>作者：{{ info.author }}</span></p>
        <p>官网：<a :href="info.link" target="_blank">{{ info.link }}</a></p>
        <p>联系方式：{{ info.phone }}</p>
        <p>地址：{{ info.address }}</p>
      </header>
      <article class="article-detail" v-html="info.desc" />
    </div>
  </div>

</template>
<script>
export default {
  name: 'Introduction',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  created() {
    // 2
  }
  // beforeRouteEnter(to, from, next) {
  //   // 1
  //   next((vm) => {
  //     // 3
  //     if (to.params.designer) {
  //       vm.designer = to.params.designer
  //     }
  //     // if (to.query.type === "today") {
  //     //   let today = new Date();
  //     //   vm.query.StartTime = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} 00:00:00`;
  //     //   vm.query.EndTime = new Date();
  //     //   vm.getTickets();
  //     // }
  //   })
  // }
}
</script>
<style lang="scss" scoped>
.intro-container{
  width: 70%;
  margin: 0 auto;
  min-width: 900px;
  header{
    text-align: center;
    border-bottom: 1px solid #E2E2E2;
  }
  p,span{
    margin-right: 20px;
    font-size: 14px;
    color: #808080;
  }
  a:hover{
    color: #3282b8;
  }
}
</style>
