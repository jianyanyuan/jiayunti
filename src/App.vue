<!--
 * @Author: your name
 * @Date: 2020-10-13 09:15:58
 * @LastEditTime: 2020-12-29 16:39:53
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
li {
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
// 展示居中
.dialog-center-public .el-dialog__body {
  text-align: center;
}
.dialog-center-public img {
  width: 100%;
  // object-fit: scale-down;
}
// 空内容
.empty-content-public {
  line-height: 60px;
  color: #909399;
  text-align: center;
  font-size: 24px;
}

// table expand展开
.table-expand-public {
  width: 100%;
  margin-bottom: 30px;
  .el-card__header {
    background: #409eff;
    color: #fff;
  }
  .expand-form-p {
    label {
      width: 100px;
      color: #99a9bf;
    }
    .el-form-item {
      margin-left: 150px;
      margin-bottom: 0;
      width: 100%;
    }
  }
}
</style>
