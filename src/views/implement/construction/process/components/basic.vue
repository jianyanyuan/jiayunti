<!--
 * @Author: zfd
 * @Date: 2020-10-19 14:51:05
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:27:00
 * @Description: 施工端资料查看
-->
<template>
  <div v-loading="pageLoading">
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
          {{ basic.applicantName }}
        </el-form-item>
        <el-form-item label="申请时间">
          {{ basic.createTime }}
        </el-form-item>
        <el-form-item label="用户地址">
          {{ basic.address }}
        </el-form-item>
        <el-form-item label="电话">
          {{ basic.phoneNumber }}
        </el-form-item>
        <el-form-item label="加装电梯地址">
          {{ basic.location }}
        </el-form-item>
        <el-form-item label="设计单位">
          {{ basic.designName }}
        </el-form-item>
        <el-form-item label="设备">
          {{ basic.device }}
        </el-form-item>
      </el-form>

    </el-card>

    <!-- 施工图查看 -->
    <el-card class="basic-container" style="margin-bottom:30px">
      <div slot="header">
        <span>施工图设计稿</span>
      </div>
      <upload-list :files="files" list-type="picture-card" :disabled="true" />
    </el-card>
    <div style="text-align:center">
      <el-button type="success" icon="el-icon-arrow-right" @click.native.prevent="nextProcess(1)">下一步</el-button>
    </div>
  </div>
</template>

<script>

import File from '@/api/file'
import { notEmptyArray } from '@/utils'
export default {
  name: 'ConstructionBasic',
  props: {
    id: {
      type: [Number, String],
      required: true
    },
    status: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      // 修改后重新保存
      pageLoading: false,
      formLoading: false,
      basic: {},
      files: [],
      projectId: null,
      staus: null
    }
  },
  activated() {
    this.detailApply()
  },
  methods: {
    detailApply() {
      this.pageLoading = true
      const basicAsync = new Promise((resolve, reject) => {
        this.$store.dispatch('getProjectBasic', this.id)
          .then(res => {
            this.basic = res
            resolve('获取成功')
          })
          .catch(() => {
            reject('基础信息获取失败')
          })
      })
      const detailAsync = new Promise((resolve, reject) => {
        File.get({ projectId: this.id, typeName: 'construction-design' })
          .then(res => {
            if (notEmptyArray(res.content)) {
              for (const i of res.content) {
                this.files.push({
                  uid: i.id,
                  name: i.filename,
                  url: i.path
                })
              }
              resolve('获取成功')
            }
          })
          .catch(() => {
            reject('基础信息获取失败')
          })
      })
      Promise.all([basicAsync, detailAsync]).then(() => {
        this.pageLoading = false
      }).catch(() => {
        this.pageLoading = false
        this.$message.error('信息获取失败')
      })
    },
    nextProcess(length) {
      this.$emit('nextProcess', length)
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
  .download-icon {
    position: absolute;
    right: 20px;
    top: 10px;
    &:hover {
      color: #409eff;
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
