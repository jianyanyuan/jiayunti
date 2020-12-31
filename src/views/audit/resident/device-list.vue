<!--
 * @Author: zfd
 * @Date: 2020-10-29 16:05:50
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-30 16:26:19
 * @Description: 设备列表
-->
<template>
  <div class="app-container">
    <article-list :list="list" />

  </div>
</template>

<script>
import ArticleList from '@/components/ArticleList'
import { listApi } from '@/api/device'
export default {
  name: 'DeviceList',
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
      listApi({ page: _this.pagination.pageIndex - 1, size: _this.pagination.pageSize }, query).then((res) => {
        _this.source = res.content.map(v => ({
          id: v.id,
          name: v.devicename,
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
