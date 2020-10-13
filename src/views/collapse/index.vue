<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-10-12 15:13:16
 * @Description: card
 * @FilePath: \vue-admin-template\src\views\collapse\index.vue
-->
<template>
  <div class="app-container">
    <div class="basic-container">
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
    </div>
    <el-collapse>
      <el-collapse-item v-for="(item, index) in dissents" :key="index">
        <template slot="title">
          建议人：{{ item.name }}
          <el-tag :type="item.status | keyToVal(handleTag)" style="margin-left:10px">{{ item.status | keyToVal(handleStatus) }}</el-tag>
        </template>
        <!-- <div>
          建议人：{{ item.name }}
          <el-tag :type="item.status | keyToVal(handleTag)">{{ item.status | keyToVal(handleStatus) }}</el-tag>
        </div> -->
        <p>时间：{{ item.time }}</p>
        <p>联系方式：{{ item.phone }}</p>
        <p>详细地址：{{ item.address }}</p>
        <div>
          <p>异议详情：</p>
          <el-input v-model="item.detail" type="textarea" />
        </div>
        <div v-if="item.status === 1">
          <p>异议反馈</p>
          <el-input v-model="item.feedback" type="textarea" />
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-dialog :title="model.title" :visible.sync="model.visible" :close-on-click-modal="false" center>
      <el-card v-for="(item, index) in model.dissents" :key="index + 100" class="box-card">
        <div slot="header" class="clearfix">
          <span>{{ "异议" + (index + 1) }}</span>
          <el-button v-if="index != 0" style="float: right; padding: 3px 0" type="text" @click="removeDissent(index)">删除</el-button>
        </div>
        <el-form :ref="model.ruleForm + index" :model="item" :rules="model.rules" label-width="100px">
          <el-form-item label="建议人" prop="name">
            <el-input v-model="item.name" />
          </el-form-item>
          <el-form-item label="时间" prop="time">
            <el-date-picker v-model="item.time" type="datetime" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-input v-model="item.phone" />
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="item.address" />
          </el-form-item>
          <el-form-item label="异议详情" prop="detail">
            <el-input v-model="item.detail" type="textarea" />
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer">
        <el-button type="primary" @click="addDissent">新增</el-button>
        <el-button type="primary" @click="addDissent">提 交</el-button>
      </span>

    </el-dialog>
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
          status: 1
        }
      ],
      model: {
        visible: false,
        title: '新增异议',
        ruleForm: {
          name: '',
          time: '',
          phone: '',
          address: '',
          detail: ''
        },
        rules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          time: [{ required: true, message: '请选择时间', trigger: 'blur' }],
          phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
          address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
          detail: [{ required: true, message: '请输入异议详情', trigger: 'blur' }]
        },
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
    }
  },
  computed: {
    ...mapState('common', ['handleStatus', 'handleTag'])
  },
  methods: {
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

