<!--
 * @Author: zfd
 * @Date: 2020-10-29 16:05:50
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 10:34:10
 * @Description: 居民文章详情
-->
<template>

  <div class="app-container">
    <article-show v-if="id" :id="id" />
  </div>

</template>

<script>
import ArticleShow from '@/components/ArticleShow'
export default {
  name: 'ArticleDetail',
  components: {
    ArticleShow
  },
  data() {
    return {
      id: null
    }
  },
  created() {
    const { id } = this.$route.params
    if (!isNaN(+id)) {
      this.id = id
    }
  },
  beforeRouteEnter(to, from, next) {
    const { id } = to.params
    if (isNaN(+id)) {
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  },
  methods: {
  }
}
</script>
