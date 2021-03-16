<!--
 * @Author: your name
 * @Date: 2020-10-13 09:15:58
 * @LastEditTime: 2021-03-16 15:21:33
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
.gap-top-public{
  margin-top:30px;
}
.gap-bottom-public{
  margin-bottom:30px;
}
.gap-both-public{
  margin:30px 0;
}
.upload-card-public  {
   .el-card__body{
      margin-bottom: 30px;
  text-align: center;
   }
   .el-upload-dragger{
     width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
   }

}
 .upload-tips-public {
  color: #14274e;
  text-align: left;
  li {
    list-style: decimal;
  }
}
// 展示居中
.dialog-center-public .el-dialog__body {
  text-align: center;
}
.dialog-center-public img {
  // width: 100%;
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

.line-divider-public {
  height: 20px;
  background: #14274e;
}
.step-btn-group-public {
  padding: 0 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  .stepBtn {
  width: 125px;
  height: 40px;
  background: #aab4be;
  color: #fff;
  text-align: center;
  line-height: 40px;
  /* cursor: pointer; */
}
.step-actived {
  background: #82a7cb;
}
}
</style>
