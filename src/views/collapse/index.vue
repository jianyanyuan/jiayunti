<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-10-11 22:38:52
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\collapse\index.vue
-->
<template>
  <div class="app-container">
    <el-collapse>
      <el-collapse-item v-for="(item, index) in dissents" :key="index">
        <template slot="title">
          "建议人："{{ item.name }}
          <el-tag :type="item.status | keyToVal(handleTag)">{item.status | keyToVal(handleStatus)}</el-tag>
        </template>
        <div>
          建议人：{{ item.name }}
          <el-tag :type="item.status | keyToVal(handleTag)">{item.status | keyToVal(handleStatus)}</el-tag>
        </div>
        <p>时间：{{ item.time }}</p>
        <p>联系方式：{{ item.phone }}</p>
        <p>详细地址：{{ item.address }}</p>
        <div>
          <p>异议详情：</p>
          <el-input v-model="item.detail" type="textarea" disabled />
        </div>
        <div v-if="item.status === 1">
          <p>异议反馈</p>
          <el-input v-model="item.feedback" type="textarea" disabled />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { keyToVal } from '@/utils'
export default {
  filters: {
    keyToVal
  },
  data() {
    return {
      dissents: [
        {
          name: '',
          time: '',
          phone: '',
          address: '',
          detail: ''
        }
      ]
    }
  },
  computed: {
    ...mapState('common', ['handleStatus', 'handleTag'])
  },
  methods: {
  }
}
</script>

<style scoped>
.head{
  height: 30px;
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  margin-bottom: 30px;
}
</style>

