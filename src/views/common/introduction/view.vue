<template>
  <div class="intro-container">
    <header>
      <h1>{{ designer.name }}</h1>
      <p>来源：<span>{{ designer.source }}</span>日期：<span>{{ designer.date }}</span><span>作者：{{ designer.author }}</span></p>
      <p>公司官网：<a :href="designer.link" target="_blank">{{ designer.link }}</a></p>
    </header>
    <article v-html="designer.desc" />
  </div>
</template>
<script>
export default {
  name: 'Introduction',
  data() {
    return {
      designer: {
        name: '东莞市六田精密电子有限公司',
        source: '东莞市六田精密电子有限',
        date: '2019-01-15 18:11',
        author: '非尔思科技',
        desc: '<p><span style=\"color: rgb(68, 68, 68); font-family: 微软雅黑, Arial; background-color: rgb(255, 255, 255);\">东莞市六田精密电子有限公司成立于2010年5月，是一家专业设计制造精密五金冲压模具、生产精密端子、外壳、精密弹片等精密五金冲压件，模具工装件的五金冲压厂家。产品广泛应用于移动电脑设备，数位相机，行动通讯设备、汽车/航空/航海电子零组件，医疗电子、智能家电、IC、3C产品及户外防水等领域。</span></p><p><img src=\"http://www.szfec.cn/uploads/190109/1-1Z109160005K3.jpg\" alt=\"东莞市六田精密电子有限公司\"/></p>',
        link: 'http://www.szfec.cn/case/qiyewangzhananli/9.html'
      }
    }
  },
  created() {
    console.log('created')
    // 2
  },
  beforeRouteEnter(to, from, next) {
    // 1
    next((vm) => {
      // 3
      if (to.params.designer) {
        vm.designer = to.params.designer
      }
      // if (to.query.type === "today") {
      //   let today = new Date();
      //   vm.query.StartTime = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()} 00:00:00`;
      //   vm.query.EndTime = new Date();
      //   vm.getTickets();
      // }
    })
  }
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
