<!--
 * @Author: zfd
 * @Date: 2020-12-23 09:32:49
 * @LastEditors: zfd
 * @LastEditTime: 2021-01-06 16:28:50
 * @Description: 街道图表
-->
<template>
  <div class="app-container chart-container">
    <el-row :gutter="10" class="container-top">
      <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="16">
        <el-card header="已加装电梯分布图" style="margin-bottom: 20px;">
          <div id="chartMap" class="chart-box" />
          <div class="chart-aside hidden-md-and-down">
            <div class="aside-item">
              <span class="aside-content"> <i class="aside-content-before" :style="{background:getColor(100)}" /> 白洋湾街道 100</span>
              <span class="aside-content"><i class="aside-content-before" :style="{background:getColor(70)}" /> 苏锦街道 70</span>
            </div>
            <div class="aside-item">
              <span class="aside-content"> <i class="aside-content-before" :style="{background:getColor(60)}" /> 虎丘街道 60</span>
              <span class="aside-content"><i class="aside-content-before" :style="{background:getColor(50)}" /> 平江街道 50</span>
            </div>
            <div class="aside-item">
              <span class="aside-content"> <i class="aside-content-before" :style="{background:getColor(40)}" /> 金阊街道 40</span>
              <span class="aside-content"><i class="aside-content-before" :style="{background:getColor(30)}" /> 沧浪街道 30</span>
            </div>
            <div class="aside-item">
              <span class="aside-content"> <i class="aside-content-before" :style="{background:getColor(20)}" /> 吴门桥街道 20</span>
              <span class="aside-content"><i class="aside-content-before" :style="{background:getColor(10)}" /> 双塔街道 10</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="8">
        <el-card class="container-aside" style="margin-bottom:20px" header="正在申请中">
          <svg-icon icon-class="applyIcon" class="aside-icon" />
          <div class="card-message">
            <div class="card-num">10,000</div>
          </div>
        </el-card>
        <el-card class="container-aside" header="已安装" style="margin-bottom: 20px;">
          <svg-icon icon-class="completed" class="aside-icon" />
          <div class="card-message">
            <div class="card-num">10,000</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card style="width:100%">
      <el-row slot="header" type="flex" justify="space-between" align="middle">
        <div class="tabs-nav-list">
          <div :class="['tabs-tab',{'tabs-tab-active':btnFocusId === 0}]" @click="btnFocusId = 0">
            新增申请
          </div>
          <div :class="['tabs-tab',{'tabs-tab-active':btnFocusId === 1}]" @click="btnFocusId = 1">
            已加装数
          </div>
        </div>
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
      <div id="chartLine" class="chart-box" />
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
      chartMap: null,
      chartLine: null,
      mapData: require('@/assets/chart/gusuStreet.json'),
      btnFocusId: 0
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
          trigger: 'item',
          formatter: '{b}<br/>{c}台'
        },
        toolbox: {
          show: true,
          orient: 'horizontal',
          top: 'top',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 0,
          max: 100,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['#87CEFA', '#F8FC11', '#FF4500']
          }
        },
        series: [
          {
            name: '姑苏区已加装电梯',
            type: 'map',
            aspectScale: 0.8, // 长宽比
            map: 'gusu', // 自定义扩展图表类型
            label: {
              show: true
            },
            left: '18%',
            data: [
              { name: '白洋湾街道', value: 100 },
              { name: '苏锦街道', value: 70 },
              { name: '虎丘街道', value: 60 },
              { name: '平江街道', value: 50 },
              { name: '金阊街道', value: 40 },
              { name: '沧浪街道', value: 30 },
              { name: '吴门桥街道', value: 20 },
              { name: '双塔街道', value: 10 },
              { name: '姑苏区', value: 380 }
            ]
            // 自定义名称映射
            // nameMap: {
            //   '白洋湾街道': '白洋湾',
            //   '双塔街道': '双塔'

            // }
          }
        ]
      }
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
          bottom: 50,
          containLabel: true
        },
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
      this.chartMap = this.$echarts.init(document.getElementById('chartMap'))
      this.chartLine = this.$echarts.init(document.getElementById('chartLine'))
      this.chartLine.setOption(lineOption)
      this.chartMap.setOption(mapOption)
    },
    resizeChart() {
      this.chartMap.resize()
      this.chartLine.resize()
    },
    // 根据比率获取渐变色
    getColor(num) {
      if (num > 50) {
        const rate = (num - 50) / 50
        const deltaR = parseInt('FF', 16) - parseInt('F8', 16)
        const deltaG = parseInt('45', 16) - parseInt('FC', 16)
        const deltaB = parseInt('00', 16) - parseInt('11', 16)
        const endR = parseInt(deltaR * rate) + parseInt('F8', 16)
        const endG = parseInt(deltaG * rate) + parseInt('FC', 16)
        const endB = parseInt(deltaB * rate) + parseInt('11', 16)
        return `rgb(${endR},${endG},${endB})`
      } else if (num < 50) {
        const rate = num / 50
        const deltaR = parseInt('F8', 16) - parseInt(87, 16)
        const deltaG = parseInt('FC', 16) - parseInt('CE', 16)
        const deltaB = parseInt('11', 16) - parseInt('FA', 16)
        const endR = parseInt(deltaR * rate) + parseInt('87', 16)
        const endG = parseInt(deltaG * rate) + parseInt('CE', 16)
        const endB = parseInt(deltaB * rate) + parseInt('FA', 16)
        return `rgb(${endR},${endG},${endB})`
      } else {
        return '#F8FC11'
      }
    },
    switchFocus(e) {
      console.log(this.$refs.btnGroup)
    }
  }
}
</script>
<style lang="scss" scoped>
.chart-container {
  &::v-deep .el-card__body {
    position: relative;
  }
  .container-top {
    height: 600px;
  }
  .container-aside {
    height: 288px;
    &::v-deep .el-card__body {
      position: relative;
      padding-top: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .aside-icon {
      font-size: 80px;
      margin: 14px 0 0 30px;
      // -webkit-transition: all 0.38s ease-out;
      // transition: all 0.38s ease-out;
    }
    .card-message {
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
    }
    .card-num {
      margin-right: 10%;
      font-size: 40px;
    }
  }
  .chart-aside {
    position: absolute;
    right: 40px;
    top: 40%;
    // width: 280px;
  }
  .aside-item {
    margin-bottom: 10px;
  }
  .aside-content {
    display: inline-block;
    width: 150px;
    margin-right: 20px;
    position: relative;
  }
  .aside-content-before {
    color: #fff;
    display: inline-block;
    position: relative;
    top: 4px;
    margin-right: 5px;
    width: 20px;
    height: 20px;
    // background-color: red;
  }
  .tabs-nav-list {
    position: relative;
    display: flex;
    transition: transform 0.3s;
    .tabs-tab {
      position: relative;
      // display: inline-flex;
      // align-items: center;
      margin: 0 32px 0 0;
      padding: 12px 0;
      font-size: 14px;
      background: 0 0;
      border: 0;
      outline: none;
      cursor: pointer;
    }
    .tabs-tab-active {
      color: #1890ff;
      font-weight: 500;
      border-bottom: 2px solid #1890ff;
    }
  }
}
.chart-box {
  height: 500px;
}
</style>
