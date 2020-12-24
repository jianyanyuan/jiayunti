<!--
 * @Author: zfd
 * @Date: 2020-10-29 16:05:50
 * @LastEditors: zfd
 * @LastEditTime: 2020-10-30 14:55:07
 * @Description: 设备列表
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
    list(_this) {
      _this.pageLoding = true
      Designer.list({ page: _this.pagination.pageIndex - 1, size: _this.pagination.pageSize }).then((res) => {
        _this.source = res.content.map(v=>({
          id:v.id,
          name:v.designname,
          address:v.address,
          phone:v.phone
        }))
        _this.total = res.totalElements
      })
      .catch(()=>{
        _this.$message.error('列表获取失败')
      })
        .finally(() => {
          _this.pageLoding = false
        })
    }
  }
}
</script>
