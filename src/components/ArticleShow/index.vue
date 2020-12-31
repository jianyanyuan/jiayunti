<!--
 * @Author: zfd
 * @Date: 2020-10-29 15:46:07
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 10:43:16
 * @Description:
-->
<template>
  <div v-loading="pageLoading" class="app-container">
    <el-page-header content="详情页面" @back="$router.go(-1)" />
    <template v-if="detail">
      <div class="intro-container">
        <header>
          <h1>
            {{ detail.companyName }}
          </h1>
          <p v-if="detail.articleSource || detail.author">
            <span v-if="detail.articleSource">来源：{{ detail.articleSource }}</span>
            <span v-if="detail.author">作者：{{ detail.author }}</span>
          </p>
          <p>
            <span>地址：{{ detail.address }}</span>
            <span>联系方式：{{ detail.phone }}</span>
            <a v-if="detail.link" :href="detail.link" target="_blank">公司官网：{{ detail.link }}</a>
          </p>
        </header>
        <article v-html="detail.introduction" />
      </div>
    </template>
    <div v-else class="empty-content-public">暂无介绍</div>
  </div>

</template>
<script>
import Common from '@/api/common'
export default {
  name: 'Introduction',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      pageLoading: false,
      detail: null
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      this.pageLoading = true
      Common.getArticleById(this.id)
        .then(res => {
          if (res) {
            this.detail = res
          }
        })
        .catch(() => {
          this.$message.error('信息获取失败')
        })
        .finally(() => {
          this.pageLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.intro-container {
  width: 70%;
  margin: 0 auto;
  min-width: 900px;
  header {
    text-align: center;
  }
  p,
  span {
    margin-right: 20px;
    font-size: 14px;
    color: #808080;
  }
  a:hover {
    color: #3282b8;
  }
}
</style>
