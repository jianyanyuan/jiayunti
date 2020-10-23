<!--
 * @Author: your name
 * @Date: 2020-10-14 09:06:05
 * @LastEditTime: 2020-10-23 13:41:03
 * @LastEditors: zfd
 * @Description: In User Settings Edit
 * @FilePath: \jiayunti\src\components\street\design\index.vue
-->
<template>
  <div>
    <el-tabs tab-position="left">
      <el-tab-pane label="基本信息">
        <el-card class="expand-info">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="设计单位">
              <span>{{ design.org }}</span>
            </el-form-item>
            <el-form-item label="时间">
              <span>{{ design.time }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ design.phone }}</span>
            </el-form-item>
            <el-form-item label="详细地址">
              <span>{{ design.address }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="设计方案">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane label="施工图设计">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Design',
  data() {
    return {
      design: {
        org: '建研院',
        time: '2020-10-12 10:56',
        address: '苏州高新区',
        phone: '15988800323'
      },
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      ]
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.expand-info .demo-table-expand ::v-deep label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 150px;
  margin-bottom: 0;
  width: 100%;
}
</style>
