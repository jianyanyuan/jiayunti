<!--
 * @Author: zfd
 * @Date: 2020-10-11 19:55:23
 * @LastEditTime: 2020-12-14 17:10:27
 * @Description: 居民异议反馈查看
 * @FilePath: \vue-admin-template\src\views\collapse\index.vue
-->
<template>
  <div class="app-container" v-loading="pageLoading">
    <el-page-header content="异议反馈" style="margin-bottom:50px" @back="$router.go(-1)" />
    <el-collapse>
      <el-collapse-item v-for="(item, index) in objection" :key="index">
        <template slot="title">
          建议人：{{ item.adviceName }}
          <el-tag :type="item.result | keyToVal(handleTag)" style="margin-left:20px">{{ item.result | keyToVal(checkOptions) }}</el-tag>
        </template>
        <el-form label-width="120px" class="center-form">
          <el-form-item label="时间：">
            {{ item.time }}
          </el-form-item>
          <el-form-item label="联系方式：">
            {{ item.phoneNumber }}
          </el-form-item>
          <el-form-item label="详细地址：">
            {{ item.address }}
          </el-form-item>
          <el-form-item label="异议详情：">
            {{ item.objection }}
          </el-form-item>
          <el-form-item label="异议反馈：">
            {{ item.toObjection }}
          </el-form-item>
          <el-form-item label="处理结果：">
            {{ item.result | keyToVal(checkOptions) }}
          </el-form-item>
        </el-form>

      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import Community from '@/api/community'
import { notEmptyArray } from '@/utils'
export default {
  data() {
    return {
      pageLoading: false,
      objection: [],
      applyId: null,
      status:null
    }
  },
  computed: {
    ...mapState('common', ['checkOptions', 'handleTag'])
  },
  created() {
    const { id, status } = this.$route.params
    // 3异议查看
    if (!isNaN(+id) && status == 3) {
      this.applyId = id
      this.status = status
      this.detailApply()
    }
  },
  methods: {
    detailApply() {
      this.pageLoading = true
      Community.listObjection(this.applyId)
        .then(res => {
          if (notEmptyArray(res)) {
            this.pageLoading = false
            this.objection = res
          }
        })
        .catch((err) => {
          console.log(err)
          this.pageLoading = false
          this.$message.error('信息获取失败')
        })
    
    },
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id, status } = to.params
    // 公示阶段，异议查看
    if (isNaN(+id) || status != 3) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
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

