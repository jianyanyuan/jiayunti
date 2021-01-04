<!--
 * @Author: zfd
 * @Date: 2020-12-23 09:32:49
 * @LastEditors: zfd
 * @LastEditTime: 2021-01-04 15:49:05
 * @Description: 街道图表
-->
<template>
  <div class="app-container chart-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
        <el-card header="已加装电梯分布图">
          <div id="chartMap" class="chart-box" />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
        <el-card header="正在申请中" />
        <el-card header="已安装总数" />
      </el-col>
    </el-row>
    <el-card>
      <el-row slot="header" type="flex" justify="space-between" align="middle">
        <span>新增申请</span>
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
      我是图表
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
      input3: '',
      chartMap: null,
      mapData: require('@/assets/chart/gusu.json')
    }
  },
  created() {
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
      this.$echarts.registerMap('gusu', this.mapData)
      const mapOption = {
        tooltip: {
          trigger: 'item'
          // formatter: '{b}<br/>{c} (p / km2)'
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 800,
          max: 50000,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['lightskyblue', 'yellow', 'orangered']
          }
        },
        series: [
          {
            name: '姑苏区已加装电梯',
            type: 'map',
            mapType: 'gusu', // 自定义扩展图表类型
            label: {
              show: true
            },
            data: [
              // {name: '中西区', value: 20057.34},
            ],
            // 自定义名称映射
            nameMap: {
              // 'Central and Western': '中西区',
            }
          }
        ]
      }
      this.chartMap = this.$echarts.init(document.getElementById('chartMap'))
      this.chartMap.setOption(mapOption)
    },
    resizeChart() {
      this.chartMap.resize()
    }
  }
}
</script>
<style lang="scss" scoped>
.chart-container {
  // &::v-deep .el-card__body {
  //     width: 100%;

  //   height: 100%;
  // }
}
.chart-box {
  height: 300px;
}
</style>
