<!--
 * @Author: zfd
 * @Date: 2020-12-23 09:32:49
 * @LastEditors: zfd
 * @LastEditTime: 2021-01-06 16:20:46
 * @Description: 违规统计
-->
<template>
  <div class="app-container">

    <el-card>
      <div class="search-box">
        <el-input v-model="input3" placeholder="请输入街道" class="search-input">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </div>
      <el-table v-loading="listLoading" row-key="id" style="width:100%" :data="list" :default-sort="{prop: 'addTime', order: 'descending'}" fit highlight-current-row>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="项目编号" prop="projectNum" />

        <el-table-column label="最新处理时间" align="center" sortable>
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.addTime }}</span>
          </template>

        </el-table-column>
        <el-table-column
          label="项目状态"
          prop="amount"
          :filters="[{ text: '正在申请中', value: '正在申请中' }, { text: '正在施工中', value: '正在施工中' },{ text: '已安装', value: '已安装' }]"
          :filter-method="filterStatus"
        />

      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ProjectDetail',
  data() {
    return {
      value1: '',
      input3: '',
      listLoading: false,
      list: [
        { projectNum: '蒋怡凡公司', addTime: '2020-02-01 19:00:00', amount: 1000 }
      ]
    }
  },

  methods: {
    filterStatus() {}
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
.fd-card {
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
  align-items: center;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  .fd-card-icon {
    font-size: 60px;
  }
  .fd-card-desc {
    font-size: 20px;
    color: #666;
    font-weight: 700;
    .fd-card-d-title {
      margin-bottom: 20px;
      color: rgba(0, 0, 0, 0.45);
    }
    .fd-card-d-num {
      font-size: 24px;
    }
  }
}
.fd-list {
  padding: 0 32px 32px 72px;
  h4 {
    font-size: 16px;
    margin-top: 0;
    margin-bottom: 20px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
  }
  .fd-ul {
    list-style: none;
    li {
      display: flex;
      align-items: center;
      margin-top: 16px;
      zoom: 1;
      span {
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        line-height: 22px;
      }
      .fd-ranking-num {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-top: 1.5px;
        margin-right: 16px;
        font-weight: 600;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        background-color: #fafafa;
        border-radius: 20px;
      }
      .fd-ranking-num-active {
        color: #fff;
        background-color: #314659;
      }
      .fd-ranking-title {
        flex: 1 1;
        margin-right: 8px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
.chart-box {
  height: 500px;
}
</style>
