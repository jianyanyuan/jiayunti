<!--
 * @Author: zfd
 * @Date: 2020-10-29 16:05:50
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-30 11:19:40
 * @Description: 居民文章详情
-->
<template>

  <div class="app-container">
    <article-show :info="detail" />

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
      detail: {}
    }
  },
  created() {

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.detail && typeof to.params.detail === 'object') {
        vm.detail = to.params.detail
      }
    })
  },
  methods: {
    filterEntity() {

    }
  }
}
</script>
