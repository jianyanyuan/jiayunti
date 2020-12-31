<!--
 * @Author: zfd
 * @Date: 2020-10-29 16:05:50
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 10:33:03
 * @Description: 设计院列表
-->
<template>
  <div class="app-container">
    <article-list :list="list" />

  </div>
</template>

<script>
import ArticleList from '@/components/ArticleList'
import Designer from '@/api/designer'
export default {
  name: 'DesignerList',
  components: {
    ArticleList
  },
  data() {
    return {
    }
  },
  methods: {
    list(_this, query = {}) {
      _this.pageLoading = true
      Designer.list({ page: _this.pagination.pageIndex - 1, size: _this.pagination.pageSize }, query).then((res) => {
        _this.source = res.content.map(v => ({
          id: v.id,
          name: v.designname,
          address: v.address,
          phone: v.phone,
          userId: v.userId
        }))
        _this.pagination.total = res.totalElements
      })
        .catch(() => {
          _this.$message.error('列表获取失败')
        })
        .finally(() => {
          _this.pageLoading = false
        })
    }
  }
}
</script>
