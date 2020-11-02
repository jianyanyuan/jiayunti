<!--
 * @Author: zfd
 * @Date: 2020-10-29 16:05:50
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-02 09:04:58
 * @Description: 设计单位列表
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
          url: 'http://www.jsyuantian.com/contact/' // 文章地址
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
