<!--
 * @Author: your name
 * @Date: 2020-10-13 09:15:58
 * @LastEditTime: 2020-10-13 16:06:53
 * @LastEditors: Please set LastEditors
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
