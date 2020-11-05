<template>
  <div>
    <el-tabs tab-position="left">
      <el-tab-pane label="基本资料">
        <el-card class="expand-info">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="申请人">
              <span>{{ apply.name }}</span>
            </el-form-item>
            <el-form-item label="详细地址">
              <span>{{ apply.address }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ apply.phone }}</span>
            </el-form-item>
            <el-form-item label="加装电梯地址">
              <span>{{ apply.liftAddress }}</span>
            </el-form-item>
            <el-form-item label="设备规格">
              <span>{{ apply.spec }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      <el-tab-pane v-if="params.status !== 3" label="意见征询表">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane v-if="params.status !== 3" label="意见征询汇总表">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane v-if="params.status !== 3" label="委托授权书">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane v-if="params.status !== 3" label="项目协议书">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane v-if="params.status !== 1" label="公示内容">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
      <el-tab-pane v-if="params.status !== 1" label="公示报告">
        <el-card>
          <ul>
            <li v-for="url in urls" :key="url" style="text-align:center">
              <el-image :src="url" />
            </li>
          </ul>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'Resident',
  props: {
    params: {
      type: Object,
      default: {},
      required: true
    }
  },
  data() {
    return {
      apply: {
        name: '李先生',
        address: '苏州高新区',
        phone: '15988800323',
        liftAddress: '小区1楼',
        spec: '高端电梯',
        time: '2020-10-13 11:46'
      },
      urls: [
        'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
        'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
        'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg'
      ]
    }
  },
  methods: {

  }
}
</script>

<style scoped>
.expand-info .demo-table-expand ::v-deep label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-left: 150px;
  margin-bottom: 0;
  width: 100%;
}
</style>
