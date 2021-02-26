<!--
 * @Author: zfd
 * @Date: 2020-12-09 08:43:23
 * @LastEditors: zfd
 * @LastEditTime: 2020-12-31 11:27:37
 * @Description: 审核意见
-->
<template>
  <div v-loading="pageLoading" class="app-container">
    <el-page-header content="审核历史" @back="$router.go(-1)" />

    <el-timeline class="audit-timeline">
      <el-timeline-item v-for="(item, index) in list" :key="index" :timestamp="new Date(item.auditTime) | parseTime('{y}-{m}-{d} {h}:{i}')" placement="top">
        <el-card>
          <p>
            <span class="audit-tip">审核内容：</span>
            {{ item.typename }}
            <span class="audit-tip-r">审核意见：</span>
            {{ item.reviewOpinion }}
            <span class="audit-tip audit-tip-r">审核结果：</span>
            <el-tag :type="item.reviewResult | keyToVal(handleTag)">{{ item.reviewResult | keyToVal(auditOptions) }}</el-tag>
          </p>
          <p>
            <span v-if="item.files" class="audit-tip">附件：</span>

            <upload-list style="margin-top:20px" :files="item.files" list-type="picture-card" :disabled="true" />
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>

  </div>
</template>

<script>
import Community from '@/api/community'
import { mapState } from 'vuex'
import { notEmptyArray } from '@/utils'
export default {
  name: 'AuditDetail',
  data() {
    return {
      pageLoading: false,
      list: [],
      projectId: null
    }
  },
  computed: {
    ...mapState('common', ['handleTag', 'auditOptions'])
  },
  created() {
    const { id } = this.$route.query
    // 1社区第一次受理 3社区第二次受理
    // const valid = status == 1 || status == 3

    if (!isNaN(+id)) {
      this.projectId = id
      this.getDetail() // 获取详情
    }
  },
  methods: {
    async getDetail() {
      this.pageLoading = true
      await Community.checkSingle(this.projectId).then(res => {
        if (notEmptyArray(res)) {
          res.forEach(element => {
            if (element.path) {
              element.files = new Array({ uid: Date.now(), url: element.path })
            }
            this.list.push(element)
          })
        }
      }).catch(() => {
        this.$message.error('数据获取失败')
      })
      this.pageLoading = false
    }
  },
  // 获得工程Id
  beforeRouteEnter(to, from, next) {
    const { id } = to.query
    // 1社区第一次受理 3社区第二次受理
    // const valid = status == 1 || status == 3
    if (isNaN(+id)) {
      // 没有id则返回跳转
      next('/redirect' + from.fullPath)
    } else {
      next()
    }
  }
}
</script>
<style lang="scss" scoped>
.audit-timeline {
  margin-top: 30px;
  &::v-deep .el-card {
    width: 800px;
  }
  .audit-tip {
    font-size: 18px;
    color: #7d8a9c;
  }
  .audit-tip-r {
    margin-left: 20px;
  }
}
</style>
