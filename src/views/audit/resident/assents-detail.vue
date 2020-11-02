<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-11-02 08:30:23
 * @Description: 居民异议反馈查看
 * @FilePath: \vue-admin-template\src\views\collapse\index.vue
-->
<template>
  <div class="app-container">
    <el-page-header content="异议反馈" style="margin-bottom:50px" @back="$router.go(-1)" />

    <!-- <div class="basic-container">
      <el-card style="margin-bottom:30px">
        <div slot="header">
          <span>基本信息</span>
        </div>
        <div>
          <p>姓名：{{ basic.name }}</p>
          <p>详细地址：{{ basic.address }}</p>
          <p>电话：{{ basic.phone }}</p>
          <p>加装电梯地址：{{ basic.liftAddress }}</p>
          <p>设计单位：{{ basic.company }}</p>
          <p>设备规格：{{ basic.spec }}</p>
        </div>
      </el-card>
    </div> -->
    <el-collapse>
      <el-collapse-item v-for="(item, index) in dissents" :key="index">
        <template slot="title">
          建议人：{{ item.name }}
          <el-tag :type="item.status | keyToVal(handleTag)" style="margin-left:20px">{{ item.status | keyToVal(handleStatus) }}</el-tag>
        </template>
        <el-form label-width="120px" class="center-form">
          <el-form-item label="时间：">
            {{ item.time }}
          </el-form-item>
          <el-form-item label="联系方式：">
            {{ item.phone }}
          </el-form-item>
          <el-form-item label="详细地址：">
            {{ item.address }}
          </el-form-item>
          <el-form-item label="异议详情：">
            {{ item.detail }}
          </el-form-item>
          <el-form-item v-if="item.status === 1" label="异议反馈：">
            {{ item.feedback }}
          </el-form-item>
          <el-form-item v-if="item.status === 1" label="处理结果：">
            {{ item.result }}
          </el-form-item>
        </el-form>

      </el-collapse-item>
    </el-collapse>
    <!-- <el-button type="primary" size="medium" style="margin-top:30px" @click="submitFeedback">提交</el-button> -->

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
      basic: {
        name: '李先生',
        address: '苏州高新区',
        phone: '15988800323',
        liftAddress: '小区1楼',
        company: '苏州建研院',
        spec: '高端电梯'
      },
      dissents: [
        {
          name: '李先生',
          time: '2020-10-12 09:00',
          phone: '15988800123',
          address: '苏州高新区',
          detail: '设计方案不合理',
          status: 0
        },
        {
          name: '张先生',
          time: '2020-10-13 08:00',
          phone: '15988800456',
          address: '苏州高新区',
          detail: '设计方案不合理',
          feedback: '你的需求已知晓，将之后联系',
          status: 1,
          result: '达成一致' // 驳回 暂未解决
        }
      ]
    }
  },
  computed: {
    ...mapState('common', ['handleStatus', 'handleTag'])
  },
  methods: {
    submitFeedback() { },
    removeDissent(index) {
      if (index > 0) {
        this.model.dissents.splice(index, 1)
      }
    },
    addDissent() {
      this.model.dissents.push(
        {
          name: '',
          time: '',
          phone: '',
          address: '',
          detail: ''
        })
    }
  }
}
</script>

<style scoped>
.basic-container /deep/ .el-card__header:nth-child(1) {
  background: #409eff;
  color: #fff;
}
.head {
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

