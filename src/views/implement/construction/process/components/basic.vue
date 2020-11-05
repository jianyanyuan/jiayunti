<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-11-02 11:16:27
 * @Description: 施工端资料查看
-->
<template>
  <div>
    <!-- 申请人资料 -->
    <el-card style="margin-bottom:30px">
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>申请人资料</span>
        </el-row>
      </div>
      <!-- 展示 -->
      <el-form label-width="120px" class="show-form">
        <el-form-item label="申请人">
          {{ form.name }}
        </el-form-item>
        <el-form-item label="地址">
          <el-cascader v-model="form.address" :options="addressOptions" />
          <label for="address-detail" class="label-detail"> — </label>
          <el-cascader v-model="plot" :options="plotOptions" />
        </el-form-item>
        <el-form-item label="电话">
          {{ form.phone }}
        </el-form-item>
        <el-form-item label="加装电梯地址">
          {{ form.elevatorAddress }}
        </el-form-item>
        <el-form-item label="设计单位">
          {{ form.designer }}
        </el-form-item>
        <el-form-item label="设备">
          {{ form.device }}
        </el-form-item>
        <!-- <el-form-item v-for="(room, index) in form.rooms" :key="room.key" :label="'房间编号' + (index+1)">
          {{ room.val }}
        </el-form-item> -->
      </el-form>

    </el-card>

    <!-- 施工图查看 -->
    <el-card style="margin-bottom:30px">
      <div slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <span>施工图设计</span>
        </el-row>
      </div>
      <!-- 展示 -->
      <ul>
        <li v-for="url in urls" :key="url" style="text-align:center">
          <a href="#" class="download-icon">
            <i class="el-icon-download ">下载</i>
          </a>
          <img :src="url">
        </li>
      </ul>

    </el-card>
    <div style="text-align:center">
      <el-button type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
const defaultForm = {
  name: '张飞达',
  address: ['jiangsu', 'suzhou', 'gusu', 'canglang', 'shequ'],
  phone: '15988800323',
  elevatorAddress: 'xxx小区xxx幢xxx单元',
  rooms: ['401', '402', '403'],
  designer: '',
  device: ''
}
export default {
  name: 'Basic',
  data() {
    return {
      // 修改后重新保存
      hasChanged: false,
      formLoading: false,
      form: deepClone(defaultForm),
      designerOptions: [
        { key: 1, val: '建研院' },
        { key: 2, val: '设计' }
      ],
      deviceOptions: [
        {
          label: '设备1',
          value: '1',
          children: [
            {
              label: '600',
              value: '11'
            },
            {
              label: '500',
              value: '12'
            }
          ]
        },
        {
          label: '设备2',
          value: '2',
          children: [
            {
              label: '600',
              value: '22'
            }
          ]
        }
      ],
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
      ],
      plot: []
    }
  },

  computed: {
    ...mapGetters('common', ['addressOptions', 'plotOptions'])
  },
  watch: {

  },
  created() {
    this.plot = this.form.address.slice(3)

    this.form.address = this.form.address.slice(0, 3)
    // this.form.rooms = this.form.rooms.map(v => {
    //   return {

    //     key: v + '1',
    //     val: v

    //   }
    // }
    // )
  },
  methods: {

    nextProcess(arrow) {
      this.$emit('nextProcess', arrow)
    }
  }
}
</script>

<style scoped lang="scss">
// el-input__icon el-icon-arrow-down
// .show-form ::v-deep .el-cascader,
// .show-form ::v-deep .el-input__suffix-inner{
//      pointer-events: none;
//     cursor: default;
//     opacity: 0.8;
// }
li {
  position: relative;
  .download-icon{
    position: absolute;
    right: 20px;
    top: 10px;
    &:hover{
      color: #409EFF;
    }
  }
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}

.show-form ::v-deep {
  .el-cascader,
  .el-input__suffix-inner {
    pointer-events: none;
    cursor: default;
    opacity: 0.8;
  }
}
</style>
