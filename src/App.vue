<!--
 * @Author: your name
 * @Date: 2020-10-13 09:15:58
 * @LastEditTime: 2020-12-16 08:36:51
 * @LastEditors: zfd
 * @Description: In User Settings Edit
 * @FilePath: \jiayunti\src\App.vue
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style lang="scss">

// 单页面表格居中显示
.center-form {
  width: 820px;
  margin: 50px auto 0;
}
li{
  list-style: none;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
//滚动条的滑块
::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 4px;
}
// 列表筛选公共样式
.list-query-public {
  display: flex;
  flex-flow: row nowrap;
  overflow: auto hidden;
  white-space: nowrap;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  background: #efefef;
  margin-bottom: 20px;
  .el-form-item--small,
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
