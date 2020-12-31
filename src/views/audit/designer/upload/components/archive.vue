<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:34:26
 * @Description: 居民申请意见汇总表
-->
<template>
  <div>
    <el-row type="flex" justify="space-between" align="middle" style="padding:18px 20px">
      <span>档案调取</span>
      <el-button v-if="!hasChanged" type="primary" style="float:right" @click="hasChanged = !hasChanged">修改</el-button>
      <el-button v-else type="primary" style="float:right" @click="handlePost">保存</el-button>
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
        <el-table-column label="项目" min-width="180" prop="drawingPaperType" align="center">
          <template slot-scope="{row}">
            {{ row.drawingPaperType }}
          </template>
        </el-table-column>
        <el-table-column label="是否完成" min-width="180" align="center">
          <template slot-scope="{row}">
            <el-checkbox v-if="hasChanged" v-model="row.whetherComplete" @change="handleChange(row)">是</el-checkbox>
            <span v-else>{{ row.whetherComplete ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="保存时间" min-width="250" align="center">
          <template slot-scope="{row}">
            <span v-show="row.completedAt">{{ new Date(row.completedAt) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="!hasChanged" style="text-align:center; margin-top:30px">
        <el-button type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Designer from '@/api/designer'
import { notEmptyArray } from '@/utils'
export default {
  name: 'ProtocalForm',
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
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
    // 获取信息
    getRecored() {
      this.tableLoading = true
      Designer.getArchives(this.id)
        .then(res => {
          if (notEmptyArray(res)) {
            this.tableData = res
            this.tableLoading = false
          }
        })
        .catch(() => {
          this.tableLoading = false
          this.$message.error('数据获取失败')
        })
    },
    handleChange(row) {
      if (!this.updateList.includes(row)) {
        // 引用传递
        row.completedAt = Date.now()
        this.updateList.push(row)
      }
    },
    nextProcess(arrow) {
      const idx = this.tableData.findIndex(v => v.drawingPaperType.includes('必选') && v.whetherComplete === false)
      if (idx === -1) {
        this.$emit('nextProcess', arrow)
      } else {
        this.$message.error('档案未全部调取')
      }
    },
    handlePost() {
      this.tableLoading = true
      Designer.modifyArchives(this.updateList).then(res => {
        this.tableLoading = false
        this.getRecored()
      }).catch(res => {
        this.tableLoading = false
        this.$message.error('保存失败')
      })
      this.hasChanged = false
    }
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
