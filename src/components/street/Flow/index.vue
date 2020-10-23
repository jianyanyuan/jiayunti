
<template>
  <div class="main-chart" />
</template>

<script>
import echarts from 'echarts'
import { debounce } from '@/utils'
require('echarts/theme/macarons') // echarts theme

export default {
  data() {
    return {
      option: {
        // title: {
        //   text: '居民电梯申请流程图',
        //   left: 'center',
        //   top: 40
        // },
        tooltip: {
          formatter: (params) => {
            return params.data.detail || params.name
          }
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            top: 120,
            left: '10%',
            symbolSize: 50,
            zoom: 0.8,
            roam: true, // true false 'scale' 'move'
            label: {
              show: true
            },
            edgeSymbol: 'circle',
            edgeSymbolSize: [1, 1],
            lineStyle: {
              width: 2,
              color: '#000'
            },
            edgeLabel: {
              fontSize: 15,
              show: true,
              formatter: (params) => {
                return params.data.detail || ''
              }
            },
            data: [{
              name: '居民提交申请材料',
              x: 0,
              y: 0,
              symbol: 'react',
              itemStyle: {
                color: 'blue'
              },
              symbolSize: [150, 70] // 150 70 固定
            }, {
              name: '社区审核申请材料',
              x: 250, // 0 + 150 + 100
              y: 0,
              symbol: 'diamond',
              symbolSize: [150, 70],
              detail: '申请资料<br />1. 基本资料<br />2. 申请表'
            }, {
              name: '设计院方案设计',
              x: 500, // 0 + 150 + 100 + 150 + 100
              y: 0,
              symbol: 'react',
              symbolSize: [150, 70]
            },
            {
              name: '方案公示',
              x: 750,
              y: 0,
              symbol: 'react',
              symbolSize: [150, 70]
            },
            {
              name: '异议处理',
              x: 750,
              y: 170,
              symbol: 'diamond',
              symbolSize: [150, 70]
            },
            {
              name: '居民提交公示材料',
              x: 500,
              y: 170,
              symbol: 'react',
              symbolSize: [150, 70]
            },
            {
              name: '社区审核公示材料',
              x: 250,
              y: 170,
              symbol: 'diamond',
              symbolSize: [150, 70]
            },
            {
              name: '管道踏勘',
              x: 0,
              y: 170,
              symbol: 'react',
              symbolSize: [150, 70]
            },
            {
              name: '施工图设计',
              x: 0,
              y: 340,
              symbol: 'react',
              symbolSize: [150, 70]
            },
            {
              name: '施工图审核',
              x: 250,
              y: 340,
              symbol: 'diamond',
              symbolSize: [150, 70]
            },
            {
              name: '街道审核',
              x: 500,
              y: 340,
              symbol: 'diamond',
              symbolSize: [150, 70]
            }
            ],
            // links: [],
            links: [{
              source: 0,
              target: 1
            }, {
              source: 1,
              target: 2,
              detail: '通过'
            }, {
              source: 2,
              target: 3
            }, {
              source: 3,
              target: 4
            }, {
              source: 4,
              target: 5,
              detail: '通过'
            }, {
              source: 5,
              target: 6
            }, {
              source: 6,
              target: 7,
              detail: '通过'
            }, {
              source: 7,
              target: 8
            }, {
              source: 8,
              target: 9
            }, {
              source: 9,
              target: 10
            }, {
              source: 10,
              target: 0,
              detail: '不通过',
              lineStyle: {
                curveness: -0.3
              }
            }]
          }
        ]
      },
      charts: null
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
  },
  mounted() {
    window.onresize = debounce(() => {
      if (this.charts) {
        this.charts.resize()
      }
    }, 100)
    this.$nextTick(() => {
      this.drawChart()
    })
  },
  beforeDestroy() {
    window.onresize = null
    if (!this.charts) {
      return
    }
    this.charts.dispose()
    this.charts = null
  },
  methods: {
    drawChart() {
      this.charts = echarts.init(this.$el, 'macarons')
      this.charts.setOption(this.option)
    }
  }

}
</script>

<style lang="scss" scoped>
.main-chart {
  // background-color: aquamarine;
  margin: 0 auto;
  width: 800;
  height: 600px;
}
</style>
