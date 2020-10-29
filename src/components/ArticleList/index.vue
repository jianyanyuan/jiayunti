<!--
 * @Author: zfd
 * @Date: 2020-10-29 15:36:07
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-29 16:41:23
 * @Description:
-->
<template>
  <div class="list-container">

    <article>
      <article-show :info="source[current].detail || {}" class="article-container" />
    </article>
    <aside>
      <ul>
        <li v-for="(s, index) in source" :key="index" @click="current = index">
          <p>{{ s.name }}</p>
          <p>{{ s.address }}</p>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
import ArticleShow from '@/components/ArticleShow'
export default {
  name: 'ArticleList',
  components: {
    ArticleShow
  },
  props: {
    source: {
      type: Array,
      required: true,
      validator: function(value) {
        return value.length > 0
      }
    }
  },
  data() {
    return {
      current: 0
    }
  }

}
</script>
<style lang="scss" scoped>
.list-container{
  display: flex;
  // position: relative;
  aside{
    position: fixed;
    top: 50px;
    right: 20px;
        height: 100vw;

    width: 400px;
    // padding-right: 20px;
    border-left: 1px solid slategrey;
    li{
      margin: 10px 0;
      border: 1px solid #409EFF;
      padding: 8px;
      font-size: 16px;
      color: bisque;
    }
  }
  .article-container{
      padding: 0 450px 0 40px;
    }
}
</style>
