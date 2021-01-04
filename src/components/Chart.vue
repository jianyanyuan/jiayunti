<!--
 * @Author: zfd
 * @Date: 2020-12-28 16:11:04
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-28 16:21:34
 * @Description: 
-->
<template>
  <div :id="id" :class="className"></div>
</template>
<script>

export default {
  name: 'Chart',
  props: {
    id: {
      type: String,
      required: true,
      default: Date.now().toString()
    },
    className: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  created() {
    this.chart = this.$echarts.init(document.getElementById(this.id))
    this.chart.setOption(this.options)
  },
  methods: {

  },
  mounted() {
    let _this = this
    window.onresize = function () {
      _this.chart.resize()
    }
  },
  beforeDestroy() {
    window.onresize = null; //取消监听事件
  },
}
</script>