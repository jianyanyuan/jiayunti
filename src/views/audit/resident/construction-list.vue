<!--
 * @Author: zfd
 * @Date: 2020-10-29 16:05:50
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-02 09:05:31
 * @Description: 施工单位列表
-->
<template>
  <div class="app-container">
    <article-list :source="source" />
  </div>
</template>

<script>
import ArticleList from '@/components/ArticleList'
export default {
  name: 'DeviceList',
  components: {
    ArticleList
  },
  data() {
    return {
      source: [
        {
          name: '贝特斯电梯',
          address: '中国江苏省南京市玄武区珠江路687号2幢',
          detail: {
            name: '东莞市六田精密电子有限公司',
            source: '东莞市六田精密电子有限',
            date: '2019-01-15 18:11',
            phone: '15988800323',
            address: '中国江苏省南京市玄武区珠江路687号2幢',
            author: '非尔思科技',
            desc: '<p><span style=\"color: rgb(68, 68, 68); font-family: 微软雅黑, Arial; background-color: rgb(255, 255, 255);\">东莞市六田精密电子有限公司成立于2010年5月，是一家专业设计制造精密五金冲压模具、生产精密端子、外壳、精密弹片等精密五金冲压件，模具工装件的五金冲压厂家。产品广泛应用于移动电脑设备，数位相机，行动通讯设备、汽车/航空/航海电子零组件，医疗电子、智能家电、IC、3C产品及户外防水等领域。</span></p><p><img src=\"http://www.szfec.cn/uploads/190109/1-1Z109160005K3.jpg\" alt=\"东莞市六田精密电子有限公司\"/></p>',
            link: 'http://www.szfec.cn/case/qiyewangzhananli/9.html'
          }
          // url: 'http://www.jsyuantian.com/contact/' // 文章地址
        },
        {
          name: 'http://www.jsyuantian.com/contact/',
          address: '广东省深圳市坪山新区坑梓街道金沙工业区',
          url: 'http://www.matiz.com.cn/plus/list.php?tid=30' // 文章地址
        }
      ]
    }
  },
  created() {

  }
}
</script>
