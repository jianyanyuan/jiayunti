<!--
 * @Author: your name
 * @Date: 2020-10-13 09:15:58
 * @LastEditTime: 2020-11-03 10:17:30
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
  name: 'App',
  created() {
    this.$store.dispatch('common/getAddress')
  }
}
</script>
<style lang="scss">
// .el-upload-dragger {
//   padding: 40px 5px;
//   border: 2px solid #e5e5e5;
//   color: #777;
//   -webkit-transition: background-color 0.2s linear;
//   transition: background-color 0.2s linear;
// }
// .el-upload-dragger:hover{
//   background: #f6f6f6;
//   border:2px solid #efefef;
// }
// 单页面表格居中显示
.center-form {
  width: 820px;
  margin: 50px auto 0;
}
li{
  list-style: none;
}
::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}
//滚动条的滑块
::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 4px;
}
</style>
