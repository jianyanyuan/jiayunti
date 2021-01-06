<!--
 * @Author: zfd
 * @Date: 2020-12-23 09:32:49
 * @LastEditors: zfd
 * @LastEditTime: 2021-01-06 16:20:46
 * @Description: 违规统计
-->
<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <div class="fd-card">
          <svg-icon icon-class="company" class="fd-card-icon" />
          <div class="fd-card-desc">
            <div class="fd-card-d-title">违规公司</div>
            <div class="fd-card-d-num">10,000</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <div class="fd-card">
          <svg-icon icon-class="lift" class="fd-card-icon" />
          <div class="fd-card-desc">
            <div class="fd-card-d-title">违规项目</div>
            <div class="fd-card-d-num">10,000</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <div class="fd-card">
          <svg-icon icon-class="reform" class="fd-card-icon" />
          <div class="fd-card-desc">
            <div class="fd-card-d-title">违规整改中</div>
            <div class="fd-card-d-num">10,000</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
        <div class="fd-card">
          <svg-icon icon-class="success" class="fd-card-icon" />
          <div class="fd-card-desc">
            <div class="fd-card-d-title">整改完成</div>
            <div class="fd-card-d-num">10,000</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-card style="margin-bottom:20px">
      <el-row slot="header" type="flex" justify="space-between" align="middle">
        <span>违规公司统计</span>
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
        <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
          <div id="chartLine" class="chart-box" style="margin-bottom:20px" />
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <div class="fd-list" style="margin-bottom:20px">
            <h4 class="fd-list-title">违规公司排名（违规次数）</h4>
            <ul class="fd-ul">
              <li>
                <span class="fd-ranking-num fd-ranking-num-active">1</span>
                <span class="fd-ranking-title">蒋怡凡公司</span>
                <span>10,000,000,000</span>
              </li>
              <li>
                <span class="fd-ranking-num fd-ranking-num-active">2</span>
                <span class="fd-ranking-title">蒋怡凡公司</span>
                <span>10,000,000,000</span>
              </li>
              <li>
                <span class="fd-ranking-num fd-ranking-num-active">3</span>
                <span class="fd-ranking-title">蒋怡凡公司</span>
                <span>10,000,000,000</span>
              </li>
              <li>
                <span class="fd-ranking-num">4</span>
                <span class="fd-ranking-title">蒋怡凡公司</span>
                <span>10,000,000,000</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <div class="search-box">
        <el-input v-model="input3" placeholder="请输入公司" class="search-input">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </div>
      <el-table v-loading="listLoading" row-key="id" style="width:100%" :data="list" :default-sort="{prop: 'addTime', order: 'descending'}" fit highlight-current-row>
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="公司名" prop="name" />
        <el-table-column label="违规次数" align="center" sortable>
          <template slot-scope="{row}">
            <i class="el-icon-time" />
            <span>{{ row.count }}</span>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      value1: '',
      input3: '',
      radio3: '',
      chartLine: null,
      listLoading: false,
      list: [
        { name: '蒋怡凡公司', count: 1000 },
        { name: '蒋怡凡2号公司', count: 100 }
      ]
    }
  },
  mounted() {
    this.initChart()
    window.onresize = () => {
      this.resizeChart()
    }
  },
  beforeDestroy() {
    window.onresize = null
  },
  methods: {
    initChart() {
      const lineOption = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          right: 80
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '50',
          containLabel: true
        },
        dataZoom: [{
          show: true,
          height: 30,
          xAxisIndex: [0],
          bottom: 10,
          'start': 10,
          'end': 80,
          handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
          handleSize: '110%',
          handleStyle: {
            color: '#3398DB'
          }
        }, {
          type: 'inside',
          show: true,
          height: 15,
          start: 1,
          end: 35
        }],
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '柱状图',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220]
          },
          {
            name: '折线图',
            data: [10, 52, 200, 334, 390, 330, 220],
            type: 'line',
            color: '#FFA32E'
          }
        ]
      }
      this.chartLine = this.$echarts.init(document.getElementById('chartLine'))
      this.chartLine.setOption(lineOption)
    },
    resizeChart() {
      this.chartLine.resize()
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
