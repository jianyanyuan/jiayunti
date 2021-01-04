<!--
 * @Author: zfd
 * @Date: 2020-12-23 09:32:49
 * @LastEditors: zfd
 * @LastEditTime: 2021-01-04 15:24:19
 * @Description: 违规统计
-->
<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card :body-style="{ padding: '0px' }">
          违规公司
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card :body-style="{ padding: '0px' }">
          违规项目
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card :body-style="{ padding: '0px' }">
          违规整改中
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <el-card :body-style="{ padding: '0px' }">
          违规已解决
        </el-card>
      </el-col>
    </el-row>
    <el-card>
      <el-row slot="header" type="flex" justify="space-between" align="middle">
        <span>违规统计</span>
        <span>
          <el-radio-group v-model="radio3" class="hidden-sm-and-down" size="small" style="margin-right:20px">
            <el-radio-button label="今日" />
            <el-radio-button label="本周" />
            <el-radio-button label="本月" />
            <el-radio-button label="全年" />
          </el-radio-group>
          <el-date-picker v-model="value1" size="small" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
        </span>
      </el-row>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="16" :lg="16" :xl="16">
          我是图表
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          我是列表。公司违规排序
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <div class="search-box">
        <el-input v-model="input3" placeholder="请输入公司" class="search-input">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </div>
      违规工程列表。点进去查看违规详情及整改结果。
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      radio3: '',
      value1: '',
      input3: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.search-box {
  text-align: center;
  .search-input {
    width: 40%;
    min-width: 400px;
  }
}
</style>
