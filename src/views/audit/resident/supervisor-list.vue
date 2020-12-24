<!--
 * @Author: zfd
 * @Date: 2020-10-29 16:05:50
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-23 11:30:34
 * @Description: 监理单位列表
-->
<template>
  <div class="app-container">
    <article-list :list="list" />
  </div>
</template>

<script>
import ArticleList from '@/components/ArticleList'
import Supervision from '@/api/supervision'
export default {
  name: 'DeviceList',
  components: {
    ArticleList
  },
  methods: {
    list(_this) {
      _this.pageLoding = true
      Supervision.list({ page: _this.pagination.pageIndex - 1, size: _this.pagination.pageSize }).then((res) => {
        _this.source = res.map(v => ({
          id: v.id,
          name: v.supervisionName,
          address: v.address,
          phone: v.phone
        }))
        _this.total = 0
      })
        .catch((err) => {
          console.log(err)
          _this.$message.error('列表获取失败')
        })
        .finally(() => {
          _this.pageLoding = false
        })
    }
  }
}
</script>
