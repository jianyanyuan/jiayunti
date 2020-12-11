<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-11 13:14:32
 * @Description: 居民申请意见汇总表
-->
<template>
  <div>
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>档案调取</span>
      <el-button v-if="!hasChanged" type="primary" style="float:right" @click="hasChanged = !hasChanged">修改</el-button>
      <el-button v-else type="primary" style="float:right" @click="hasChanged = !hasChanged">保存</el-button>
    </el-row>
    <el-card>
      <div slot="header">
        <span>{{ hasChanged ? "修改" :"保存" }}</span>
      </div>
      <!-- 修改保存 -->
      <el-table v-loading="tableLoading" :data="tableData" border highlight-current-row style="width: 100%">
        <el-table-column label="序号" min-width="60" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="项目" min-width="180" prop="project" align="center">
          <template slot-scope="{row}">
            {{row.project}}
          </template>
        </el-table-column>
        <el-table-column label="是否完成" min-width="180" align="center">
          <template slot-scope="{row}">
            <el-checkbox v-if="hasChanged" v-model="row.isComplete" @change="handleChange(row)">是</el-checkbox>
            <span v-else>{{ row.isComplete ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完成时间" min-width="250" align="center" v-show="hasChanged">
          <template slot-scope="{row}">
            {{ new Date(row.finishTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}
          </template>
        </el-table-column>
      </el-table>
      <div v-if="hasChanged" style="text-align:center; margin-top:30px">
        <el-button type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import File from '@/api/file'
// import { deepClone } from '@/utils'

export default {
  name: 'ProtocalForm',
  data() {
    return {
      // 修改后重新保存
      hasChanged: false,
      tableLoading: false,
      tableData: [
        {
          project: '建筑图（必选）',
          isComplete: false
        },
        {
          project: '结构图（必选）',
          isComplete: false
        },
        {
          project: '地址踏勘报告（必选）',
          isComplete: false
        },
        {
          project: '水电图',
          isComplete: false
        },
        {
          project: '总平面图',
          isComplete: false
        }
      ],
      updateList: []
    }
  },

  computed: {
  },
  watch: {

  },
  activated() {
    this.getRecored()
  },
  methods: {
    getRecored() {

    },
    handleChange(row) {
      if (!this.updateList.includes(v => v.id === row.id)) {
        // 引用传递
        this.updateList.push(row)
      }
    },
    nextProcess(arrow) {
      this.$emit('nextProcess', arrow)
    },

  }
}
</script>

<style scoped lang="scss">
.upload-card ::v-deep .el-card__body {
  text-align: center;
  margin-bottom: 30px;
}
.enclosure-tips {
  color: #14274e;
  text-align: left;
  li {
    list-style: decimal;
  }
}
.upload-card ::v-deep .el-upload-dragger {
  width: 400px;
  padding: 40px 5px;
  border: 2px solid #e5e5e5;
  color: #777;
  -webkit-transition: background-color 0.2s linear;
  transition: background-color 0.2s linear;
}
.image-container {
  height: 200px;
  margin-bottom: 20px;
  img {
    width: auto;
    height: auto;

    max-width: 100%;
    max-height: 100%;
  }
}
</style>
