<!--
 * @Author: zfd
 * @Date: 2020-12-16 11:18:59
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-16 11:31:05
 * @Description: 
-->
<template>
  <div>
    <el-button size="mini" type="warning" plain @click="$router.push({name:routeName,params:{id,status}})">{{text}}</el-button>
  </div>
</template>
<script>
export default {
  name: 'DynamicBtn',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    status: {
      type: [String, Number],
      required: true
    }
  },
  data(){
    return {
      type:'warning',
      size:'mini',
      plain: true,
      routeName: '',
      text: '非法按钮'
    }
  },
  created() {

  },
  methods: {
    handleStatus() {
      switch (+this.status) {
        case 7:
          this.routeName = 'ResidentOffer'
          this.text = '选择报价'
          break;
      
        default:
          break;
      }
    }
  }
}
</script>